/**
 * @FileName	: OrganizationService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */

package com.fanglin.system.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.vo.OrganizationVO;
import com.fanglin.utils.Paging;

public interface OrganizationService {

	public void pageOrganization(Paging paging, List<Filter> filters, Integer company);

	public List<OrganizationVO> queryOrganization(OrganizationVO organizationVO, Integer company);

	public int addOrganization(OrganizationVO organizationItem, Integer company);

	public void updateOrganization(OrganizationVO organizationVO) throws FLException;

	public void updateOrganizationForStatus(OrganizationVO organizationVO) throws FLException;

}
