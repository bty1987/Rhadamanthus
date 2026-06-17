/**
 * @File Name		: PointRecordDao.java
 * @Package   	: com.fanglin.customer.dao
 * @Version		: 1.0
 * @Date			: 2020-9-20
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.customer.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.po.PointRecordPO;
import com.fanglin.utils.Paging;

public interface PointRecordDao extends Dao<PointRecordPO> {

	public List<PointRecordPO> queryPointRecord(Long accountId, Paging paging, List<Filter> filters);

	public PointRecordPO queryPointRecordByOrderId(String orderId);

	public void updatePointRecordByNo(String pointOrderId);

}
