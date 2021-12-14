/**
 * @FileName	: OrganizationDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date		: 2014-8-2
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
 * @Describing	: 
 */

package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.OrganizationPO;
import com.fanglin.system.vo.OrganizationVO;
import com.fanglin.utils.Paging;

public interface OrganizationDao extends Dao<OrganizationPO> {
	
	public List<OrganizationPO> pageOrganization(Paging paging, List<Filter> filters);
	
	public List<OrganizationPO> queryOrganization(OrganizationVO organizationVO, Integer company);
}
