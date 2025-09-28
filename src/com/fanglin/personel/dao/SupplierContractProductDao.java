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
import com.fanglin.personel.po.SupplierContractProductPO;

public interface SupplierContractProductDao extends Dao<SupplierContractProductPO> {

	public List<SupplierContractProductPO> querySupplierContractProduct(Long scbid);
}
