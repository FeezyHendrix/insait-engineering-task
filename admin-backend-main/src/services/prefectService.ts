import axios from 'axios';
import { OperationalError } from '../utils/error';
import logger from '../libs/pino';
import constants from '../constants';
import retryAxios from '../utils/retryAxios';
import { findDocumentById, updateDocumentStatusInDb } from '../models/documentKnowledgeModel';

export async function getFlowIdByName(flowName: string): Promise<string> {
  try {
    logger.info(`Fetching flow ID for ${flowName} from ${constants.PREFECT_API_URL}...`);
    const prefectDeploymentsUrl = `${constants.PREFECT_API_URL}/deployments/filter`;
    const res = await axios.post(prefectDeploymentsUrl, {});
    const listOfDeployments = res.data;
    const flow = listOfDeployments.find(
      (deployment: any) => deployment.name === flowName
    );
    if (!flow)
      throw new OperationalError(
        `Flow with name "${flowName}" not found`,
        new Error('Flow not found')
      );
    logger.info(`...Flow ID for ${flowName} is ${flow.id}`);
    return flow.id;
  } catch (error) {
    logger.error(`Error fetching flow ID for ${flowName}: ${error}`);
    throw new OperationalError('Failed to retrieve flow ID', error as Error);
  }
}

export async function runPrefectFlow(
  flowId: string,
  parameters: Record<string, any>
): Promise<any> {
  try {
    const prefectRunFlowUrl = `${constants.PREFECT_API_URL}/deployments/${flowId}/create_flow_run`;
    const response = await retryAxios.post(prefectRunFlowUrl, {
      parameters,
      state: { type: 'SCHEDULED' },
    });
    return response.data;
  } catch (error) {
    logger.error(`Error running Prefect flow: ${error}`);
    throw new OperationalError(
      'Failed to initiate Prefect flow',
      error as Error
    );
  }
};

export async function runPrefectCreateDocumentFlow(
  fileKey: string,
  documentId: string
): Promise<void> {
  try {
    const flowId = await getFlowIdByName(constants.DOCUMENT_PREFECT_FLOW_NAME);
    await runPrefectFlow(flowId, {
      incoming_file_key: fileKey,
      action: 'create',
      file_id: documentId,
    });
    logger.info(
      `Prefect "Create" flow triggered successfully for file: ${fileKey}...`
    );
    setTimeout(async () => {
      await setPendingFileToError(documentId);
    }, constants.KB_UPLOAD_TIMEOUT_MINUTES * 60 * 1000); // if prefect flow doesn't update the file's status to anything but PENDING in 20 minutes, 
    // set status to ERROR
  } catch (error) {
    logger.error(`Error triggering Prefect "Create" flow for file: ${fileKey}`);
    throw error;
  }
}

export async function runPrefectDeleteDocumentFlow(
  fileKey: string
): Promise<void> {
  try {
    const flowId = await getFlowIdByName(constants.DOCUMENT_PREFECT_FLOW_NAME);
    await runPrefectFlow(flowId, {
      incoming_file_key: fileKey,
      action: 'delete',
    });
    logger.info(
      `Prefect "Delete" flow triggered successfully for file: ${fileKey}`
    );
  } catch (error) {
    logger.error(`Error triggering Prefect "Delete" flow for file: ${fileKey}`);
    throw error;
  }
};

async function setPendingFileToError(documentId: string): Promise<void> {
  try {
    const documentData = await findDocumentById(documentId);
    const documentStatus = documentData?.status;
    if (documentStatus === 'PENDING') {
      logger.info(`Prefect flow didn't update status for document: ${documentId} within ${constants.KB_UPLOAD_TIMEOUT_MINUTES} minutes. Setting status to ERROR...`);
      await updateDocumentStatusInDb(documentId, 'ERROR');
    };
  } catch (error) {
    logger.error(`Error setting document status to ERROR: ${error}`);
    throw error;
  }
};

export async function runPrefectURLDiscovery(
  crawlJobId: string,
  url: string,
  tenant: string,
): Promise<void> {
  try {
    const flowId = await getFlowIdByName(constants.URL_DISCOVERY_PREFECT_FLOW_NAME);
    await runPrefectFlow(flowId, {
      job_id: crawlJobId,
      url: url
    });
    logger.info(
      `Prefect ${constants.URL_DISCOVERY_PREFECT_FLOW_NAME} flow triggered successfully for url: ${url}`
    );
  } catch (error) {
    logger.error(`Error triggering Prefect ${constants.URL_DISCOVERY_PREFECT_FLOW_NAME} flow triggered successfully for url: ${url}`);
    throw error;
  }
};

// 
export async function runPrefectAppendURL(
  single_url: any,
  tenant: string
): Promise<void> {
  try {
    const flowId = await getFlowIdByName(constants.APPEND_SINGLE_URL_PREFECT_FLOW_NAME);
    logger.info(`Payload sent to Prefect: ${JSON.stringify({ single_url }, null, 2)}`);
    
    await runPrefectFlow(flowId, {
      single_url: single_url,
    });
    logger.info(
      `Prefect ${constants.APPEND_SINGLE_URL_PREFECT_FLOW_NAME} flow triggered successfully for ${single_url.url} unique URLs`
    );
  } catch (error) {
    logger.error(`Error triggering Prefect ${constants.APPEND_SINGLE_URL_PREFECT_FLOW_NAME} flow`);
    throw error;
  }
}


export async function runPrefectAppendURLs(
  urls: any,
  tenant: string
): Promise<void> {
  try {
    logger.info (`Received ${urls.length} URLs to append on tenant: ${tenant}`);
    const uniqueUrls = Array.from(new Set(urls));
    const flowId = await getFlowIdByName(constants.APPEND_URLS_PREFECT_FLOW_NAME);
    logger.info(`Triggering Prefect ${constants.APPEND_URLS_PREFECT_FLOW_NAME} flow... flowId: ${flowId}`);
    logger.info(`Payload sent to Prefect: ${JSON.stringify({ urls: uniqueUrls }, null, 2)}`);
    await runPrefectFlow(flowId, {
      urls: uniqueUrls,
    });
    logger.info(
      `Prefect ${constants.APPEND_URLS_PREFECT_FLOW_NAME} flow triggered successfully for ${uniqueUrls.length} unique URLs`
    );
  } catch (error) {
    logger.error(`Error triggering Prefect ${constants.APPEND_URLS_PREFECT_FLOW_NAME} flow`);
    throw error;
  }
}

export async function runPrefectDeleteLinkFlow({
  id,
  key
}: { id: string, key: string }): Promise<void> {
  try {
    const flowId = await getFlowIdByName(constants.DELETE_LINK_PREFECT_FLOW_NAME);
    await runPrefectFlow(flowId, {
      urls: [{ id, key }]
    });
    logger.info(
      `Prefect ${constants.DELETE_LINK_PREFECT_FLOW_NAME} flow triggered successfully for link ID: ${id}`
    );
  } catch (error) {
    logger.error(`Error triggering Prefect ${constants.DELETE_LINK_PREFECT_FLOW_NAME} flow for link ID: ${id}`);
    throw error;
  }
}

export async function runPrefectHintFlow(
  documentId: string,
  r2rId: string,
  action: string,
  newHint?: string,
  previousHint?: string,
): Promise<void> {
  try {
    const flowId = await getFlowIdByName("knowledge_hints");
    if (!flowId) {
      throw new Error(`Flow ID for knowledge_hints not found`);
    };
    const prefectResponse = await runPrefectFlow(flowId,{
      admin_id: documentId,
      r2r_id: r2rId,
      action,
      ...(newHint && { new_hint: newHint }),
      ...(previousHint && { previous_hint: previousHint }),
    });
    const flowRunId = prefectResponse.id;
    return flowRunId;
  } catch (error) {
    logger.error(`...Error triggering Prefect knowledge_hints flow for r2r document: ${r2rId}`);
    throw error;
  }
};

export function validateHintParams(
    documentId: string,
    action: string,
    target: 'r2r' | 'database',
    newHint?: string | null,
    previousHint?: string,
    existingHint?: string | null,
    r2rId?: string | null
  ): string | null {
    const validActions = ["add", "delete", "edit"];
    let errorMessage = "";

    if (!validActions.includes(action)) {
      errorMessage += `Invalid action '${action}'. Valid actions are: ${validActions.join(", ")}.\n`;
    }
    if (!documentId) {
      errorMessage += "Document ID is required.\n";
    }
    if (!['r2r', 'database'].includes(target)) {
      errorMessage += `Invalid target '${target}'. Valid targets are: 'r2r' or 'database'.\n`;
    };
    if (target === 'r2r' && !r2rId) {
      errorMessage += "R2R ID is required when target is 'r2r'.\n";
    };
    if ((action === "add" || action === "edit") && !newHint) {
      errorMessage += `New hint is required when ${action}ing hints.\n`;
    }
    if ((action === "delete" || action === "edit") && !previousHint) {
      errorMessage += `Previous hint is required when ${action}ing hints.\n`;
    }
    if (action === "delete" && newHint) {
      errorMessage += "New hint should not be provided when deleting hints.\n";
    }
    if (action === "add" && previousHint) {
      errorMessage += "Previous hint should not be provided when adding hints.\n";
    };
    if (action !== 'add' && !existingHint) {
      errorMessage += `Existing hint for document ${documentId} not found.\n`;
    };
    if (action !== 'add' && existingHint !== previousHint) {
      errorMessage += `Error ${action}ing hint. Previous hint does not match. given: ${previousHint}, existing: ${existingHint}`;
    };
    if (action === 'add' && existingHint) {
      errorMessage += `Error ${action}ing hint. Document already has a hint: ${existingHint}`;
    };

    return errorMessage || null;
};


export async function runPrefectSendQAToR2R(
  qaData: { id: string, question: string, answer: string }[]
): Promise<void> {
  try {
    const flowId = await getFlowIdByName(constants.SEND_QA_TO_R2R_PREFECT_FLOW_NAME);
    await runPrefectFlow(flowId, {
      qa_data: qaData
    });
    logger.info(
      `Prefect ${constants.SEND_QA_TO_R2R_PREFECT_FLOW_NAME} flow triggered successfully for ${qaData.length} QA items`
    );
  } catch (error) {
    logger.error(`Error triggering Prefect ${constants.SEND_QA_TO_R2R_PREFECT_FLOW_NAME} flow for QA data`);
    throw error;
  }
};
