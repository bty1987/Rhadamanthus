/**
 * @File Name		: DecorationActivityDao.java
 * @Package   	: com.fanglin.decoration.dao
 * @Version		: 1.0
 * @Date			: 2015-12-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.decoration.po.DecorationActivityPO;

public interface DecorationActivityDao extends Dao<DecorationActivityPO> {

	public List<DecorationActivityPO> queryDecorationActivityByOrderId(String orderId);
	
	public int countDecorationActivity(String orderId, Short status);

}
