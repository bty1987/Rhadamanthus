/**
 * @File Name		: MaterialBalanceDao.java
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
import com.fanglin.material.po.MaterialBalancePO;
import com.fanglin.utils.Paging;

public interface MaterialBalanceDao extends Dao<MaterialBalancePO> {

	public List<MaterialBalancePO> pageMaterialBalance(Paging paging, List<Filter> filters, int company);

}
