/**
 * @File Name		: DecorationBelongDao
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
import com.fanglin.decoration.po.DecorationBelongPO;
import com.fanglin.decoration.vo.DecorationBelongTranUserVO;
import com.fanglin.decoration.vo.DecorationBelongTranVO;
import com.fanglin.utils.Paging;

public interface DecorationBelongDao extends Dao<DecorationBelongPO> {

	public List<DecorationBelongPO> queryDecorationBelong(String orderId, Short belongType, Short status);

	public List<DecorationBelongPO> queryDecorationBelongByOrderIds(List<String> orderIds);

	public int countDecorationBelong(String orderId, short type, short status);

	public int changeDecorationBelongForOrderId(String source, String target);

	public int updateDecorationBelong(String orderId, Short type, Short source, Short target);

	public List<DecorationBelongTranUserVO> queryDecorationBelongForTran(String keyword, int company);

	public List<DecorationBelongTranVO> pageDecorationForTranByBelonger(Paging paging, int buid, short belongType, int company);

}
