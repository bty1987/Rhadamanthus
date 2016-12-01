/**
 * @File Name		: VenderBalanceDao.java
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
import com.fanglin.salary.po.VenderBalancePO;
import com.fanglin.utils.Paging;

public interface VenderBalanceDao extends Dao<VenderBalancePO> {
	
	public List<VenderBalancePO> pageVenderBalance(Paging paging, List<Filter> filters, Integer status);
	
	public VenderBalancePO queryVenderBalanceByMaterialBrandIdInit(int materialBrandId);
	
	public VenderBalancePO queryVenderBalanceByMaterialBrandNameInit(String materialBrandName);
	
	public List<VenderBalancePO> queryVenderBalanceByMaterialBrandId(int materialBrandId);
	
	public List<VenderBalancePO> queryVenderBalanceByInit();

}
