/**
 * @File Name		: PointAccountDao.java
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
import com.fanglin.customer.po.PointAccountPO;
import com.fanglin.utils.Paging;

public interface PointAccountDao extends Dao<PointAccountPO> {

	public PointAccountPO queryPointAccount(long cid);

	public PointAccountPO queryPointAccountByOrderId(int company, long cid, String orderId);

	public List<PointAccountPO> pagePointAccount(Paging paging, List<Filter> filters);

	public long amountDecorationPoint(String orderId);

	public long amountMaterialPoint(String orderId);
}
