/**
 * @File Name		: VenderPreBalanceDao.java
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
import com.fanglin.salary.po.VenderPreBalancePO;
import com.fanglin.utils.Paging;

public interface VenderPreBalanceDao extends Dao<VenderPreBalancePO>{
	
	public List<VenderPreBalancePO> pageVenderPreBalance(Paging paging, List<Filter> filters);
	
	public List<VenderPreBalancePO> pageVenderPreBalanceByMsoId(Paging paging, List<Filter> filters, long msoId);
	
	public List<VenderPreBalancePO> queryVenderPreBalanceByVbId(int vbId);

}
