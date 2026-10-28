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

	/**
	 * 按积分流水现算某账户的主材可用积分(以流水为准,不依赖cppoint.spoint字段):
	 * SUM(type=0加) - SUM(type=1扣), 仅计有效(status=0)且主材类(pointType=1)流水。
	 */
	public long sumMaterialPoint(long accountId);

}
