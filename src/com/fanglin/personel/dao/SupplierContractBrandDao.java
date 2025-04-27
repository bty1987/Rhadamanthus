/**
 * @File Name		: SupplierDao.java
 * @Package   	: com.fanglin.personel.dao
 * @Version		: 1.0
 * @Date			: 2019-10-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.po.SupplierContractBrandPO;
import com.fanglin.utils.Paging;

public interface SupplierContractBrandDao extends Dao<SupplierContractBrandPO> {

	public List<SupplierContractBrandPO> pageSupplierBrand(Paging paging, List<Filter> filters, int company, long scid);

	public List<SupplierContractBrandPO> querySupplierBrand(Long sbid);
}
