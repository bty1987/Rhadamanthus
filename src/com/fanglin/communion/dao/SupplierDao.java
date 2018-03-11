/**
 * @File Name		: SupplierDao.java
 * @Package   	: com.fanglin.data.dao
 * @Version		: 1.0
 * @Date			: 2016-9-22
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.dao;

import java.util.List;

import com.fanglin.communion.po.SupplierPO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface SupplierDao extends Dao<SupplierPO> {
	
	public List<SupplierPO> pageSupplier(Paging paging, List<Filter> filters);
	
	public SupplierPO querySupplierBySId(long sId);
	
	public SupplierPO querySupplierByLoginId(String loginId);
	
}
