/**
 * @File Name		: MaterialSubOrderPostBalanceDaoImpl.java
 * @Package   	: com.fanglin.dao.materialOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-4-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.material.dao.MaterialSubOrderPostBalanceDao;
import com.fanglin.material.po.MaterialSubOrderPostBalancePO;

@Repository("materialSubOrderPostBalanceDao")
public class MaterialSubOrderPostBalanceDaoImpl extends DaoImpl<MaterialSubOrderPostBalancePO> implements MaterialSubOrderPostBalanceDao {
	
	public MaterialSubOrderPostBalanceDaoImpl(){
		super(MaterialSubOrderPostBalancePO.class);
	}

}
