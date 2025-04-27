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
import com.fanglin.personel.po.SupplierContractGoodsPO;
import com.fanglin.utils.Paging;

public interface SupplierContractGoodsDao extends Dao<SupplierContractGoodsPO> {

	public List<SupplierContractGoodsPO> pageSupplierContractGoods(Paging paging, List<Filter> filters, int company, long scid);

	public List<SupplierContractGoodsPO> querySupplierContractGoods(Long sbid);

}
