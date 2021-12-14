/**
 * @File Name		: ProtationDao.java
 * @Package   	: com.fanglin.quotation.dao
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.quotation.po.ProtationPO;

public interface ProtationDao extends Dao<ProtationPO> {

	public List<ProtationPO> queryProtationByOrderId(String orderId);

	public ProtationPO queryProtationForDefaultByOrderId(String orderId);

	public int countProtationByOrderId(String orderId);

	public int clearProtationForDefaultByOrderId(String orderId);

}
