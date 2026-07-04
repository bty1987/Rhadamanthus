/**
 * @File Name		: DecorationBackVisitDao
 * @Package   	: com.fanglin.decoration.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			:
 * @Describing	:
 */

package com.fanglin.decoration.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.DecorationBackVisitPO;
import com.fanglin.utils.Paging;

public interface DecorationBackVisitDao extends Dao<DecorationBackVisitPO> {

	public List<DecorationBackVisitPO> pageDecorationBackVisitByOrderId(Paging paging, List<Filter> filters, String orderId);

	public List<DecorationBackVisitPO> queryDecorationBackVisitByOrderId(String orderId);

	public List<DecorationBackVisitPO> queryDecorationBackVisitByOrderIdAStartAEndTime(String orderId, Timestamp start, Timestamp end);



}
