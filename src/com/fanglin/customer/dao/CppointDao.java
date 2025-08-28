/**
 * @File Name		: CppointDao.java
 * @Package   	: com.fanglin.communion.dao
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
import com.fanglin.customer.po.CppointPO;
import com.fanglin.utils.Paging;

public interface CppointDao extends Dao<CppointPO> {

	public CppointPO queryCppoint(long cid);

	public CppointPO queryCppointByOrderId(String orderId);

	public List<CppointPO> pageCppoint(Paging paging, List<Filter> filters);

	public long amountCppoint(String orderId);
}
