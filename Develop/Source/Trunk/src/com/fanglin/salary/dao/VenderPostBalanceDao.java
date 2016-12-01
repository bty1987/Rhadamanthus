/**
 * @File Name		: VenderPostBalanceDao.java
 * @Package   	: com.fanglin.dao.salary
 * @Version		: 1.0
 * @Date			: 2014-11-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.salary.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.salary.po.VenderPostBalancePO;
import com.fanglin.utils.Paging;

public interface VenderPostBalanceDao extends Dao<VenderPostBalancePO> {
	
	public List<VenderPostBalancePO> pageVenderPostBalance(Paging paging, List<Filter> filters);
	
	public List<VenderPostBalancePO> pageVenderPostBalanceByMsoId(Paging paging, List<Filter> filters, long msoId);
	
	public List<VenderPostBalancePO> queryVenderPostBalanceByVbId(int vbId);

}
