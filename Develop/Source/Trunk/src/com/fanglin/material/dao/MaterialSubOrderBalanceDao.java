/**
 * @File Name		: MaterialSubOrderPreBalanceDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2015-4-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.po.MaterialSubOrderBalancePO;
import com.fanglin.utils.Paging;

public interface MaterialSubOrderBalanceDao extends Dao<MaterialSubOrderBalancePO> {
	
	public List<MaterialSubOrderBalancePO> pageMaterialSubOrderBalance(Paging paging, List<Filter> filters,int company);
	
}
