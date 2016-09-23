/**
 * @File Name		: MaterialSubOrderPreBalanceDaoImpl.java
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
import com.fanglin.material.dao.MaterialSubOrderBalanceDao;
import com.fanglin.material.po.MaterialSubOrderBalancePO;

@Repository("materialSubOrderBalanceDao")
public class MaterialSubOrderBalanceDaoImpl extends DaoImpl<MaterialSubOrderBalancePO> implements MaterialSubOrderBalanceDao {
	
	public MaterialSubOrderBalanceDaoImpl(){
		super(MaterialSubOrderBalancePO.class);
	}
	
	
}
