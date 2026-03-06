/**
 * @File Name	: DecorationOrderDrawLineDao
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date		: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * @Describing	: 
 */

package com.fanglin.construction.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.core.dao.Dao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface DrawLineDao extends Dao<DrawLinePO> {

	public List<DrawLinePO> pageDrawLine(Paging paging, List<Filter> filters, int company) throws FLException;

	public List<DrawLinePO> queryDrawLine(List<Filter> filters, int company) throws FLException;

	public int countDrawLine(String orderId);

	public int countDrawLine(long gid, Timestamp startTime, Timestamp endTime, int company);

	public List<?> countDrawLine(long startTime, long endTime, int company);

	public List<?> countDrawLineForTime(long startTime, long endTime, int company);

	/**
	 * 根据订单ID查询放线记录
	 * @param orderId 订单ID
	 * @return 放线记录
	 */
	public DrawLinePO queryDrawLineByOrderId(String orderId);

}
