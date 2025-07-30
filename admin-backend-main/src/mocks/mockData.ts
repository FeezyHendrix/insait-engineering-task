export const mockConfigurationResponse = {
    message: 'Configuration successfully retrieved',
    data: {
      keycloak_pub_key: 'fake-pub-key',
      keycloak_password: 'fake-password',
      keycloak_username: 'fake-username',
      keycloak_client_id: 'fake-client-id',
      twilio_from_phone: '+12892176975',
      // default_open_enabled: 1,
      // batch_message_limit: 1000,
      product: "savings_account_english",
      mask_pii: 48,
      preserve_unanswered_qs: 1,
      conversation_deletion_cutoff: 48,
      four_eyes_enabled: false
    }
}

export const mockEditableConfigurationsGet = {
  message: 'Configuration successfully retrieved',
    editable: {
      bot: {
        ui: {
          bot_name: 'My Bot',
          bot_image: 'https://cdn.insait.io/myimage.jpeg',
          color1: '#3498db',
          default_open_enabled: true
        },
        api: {
          first_message: 'Hello, how can i help you today?',
          whitelisted_urls: [{url: 'valid.url.com', variant: 'default'}],
          blacklisted_urls: [{url: 'invalid.url.com', variant: 'default'}],
          first_prompt: '    ## Task:      Answer the query given immediately below given the context which follows later. Use line item references to like [c910e2e], [b12cd2f], ... refer to provided search results.       ### Query:      {query}       ### Context:      {context}       ### Query:      {query}       REMINDER - Use line item references to like [c910e2e], [b12cd2f], to refer to the specific search result IDs returned in the provided context.',
          r2r_wrapper_params: { system_prompt: '', number_of_chunks: 20 },
        }
      }
  }
}