import { Request } from 'express'
import constants from '../constants'

export function extractTenant(req: Request): string | undefined {
  const subdomain = req.subdomains[0]
  const headerCompany = req.get('company')
  const tenantEnv = constants.TENANT

  return tenantEnv ?? headerCompany ?? subdomain
}