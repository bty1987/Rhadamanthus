/**
 * @File Name		: DecorationOrderOperateHistoryDaoImpl.java
 * @Package   	: com.fanglin.dao.decorationOrder.impl
 * @Version		: 1.0
 * @Date			: 2015-3-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.po.DecorationOperatePO;

@Repository("decorationOperateDao")
public class DecorationOperateDaoImpl extends DaoImpl<DecorationOperatePO> implements DecorationOperateDao {
	
	public DecorationOperateDaoImpl(){
		super(DecorationOperatePO.class);
	}

}
