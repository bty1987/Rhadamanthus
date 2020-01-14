/**
 * @File Name		: DecorationContractDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationContractPO;

public interface DecorationContractDao extends Dao<DecorationContractPO> {

	public List<DecorationContractPO> queryDecorationContractByOrderId(String orderId);
}
