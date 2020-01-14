/**
 * @File Name		: DecorationContractDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.po.DecorationContractPO;

@Repository("decorationContractDao")
public class DecorationContractDaoImpl extends DaoImpl<DecorationContractPO> implements DecorationContractDao {

	public DecorationContractDaoImpl(){
		super(DecorationContractPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DecorationContractPO> queryDecorationContractByOrderId(String orderId){
		return session().createCriteria(DecorationContractPO.class).add(Restrictions.eq("orderId", orderId)).list();
	}
}
