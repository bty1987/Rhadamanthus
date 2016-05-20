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
import com.fanglin.core.vo.FilterVO;
import com.fanglin.salary.po.VenderPreBalancePO;
import com.fanglin.utils.Paging;

public interface VenderPreBalanceDao extends Dao<VenderPreBalancePO>{
	
	public List<VenderPreBalancePO> pageVenderPreBalance(Paging paging, List<FilterVO> filters);
	
	public List<VenderPreBalancePO> pageVenderPreBalanceByMsoId(Paging paging, List<FilterVO> filters, long msoId);
	
	public List<VenderPreBalancePO> queryVenderPreBalanceByVbId(int vbId);

}
