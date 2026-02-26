/**
 * @File Name		: OrderDesignPictureDao
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
import com.fanglin.decoration.po.DecorationPicturePO;

public interface DecorationPictureDao extends Dao<DecorationPicturePO> {

	public List<DecorationPicturePO> queryDecorationPictureByOrderId(String orderId);

	public int countDecorationPicture(String orderId, Integer type);

	// ==================== 设计确认相关方法 ====================

	/**
	 * 批量更新图片状态
	 */
	public int batchUpdateDecorationPictureForStatusByDpids(List<Long> dpids, short status);

	/**
	 * 批量更新图片状态（带清除逻辑）
	 * @说明 如果status=4(本次确认展示)，会先清除订单下其他图片的status=4状态
	 */
	public int batchUpdateDecorationPictureForStatusByOrderIdAndDpids(String orderId, List<Long> dpids, short status);

	/**
	 * 清除订单下所有图片的确认展示状态
	 */
	public int clearDecorationPictureForConfirmShowByOrderId(String orderId);

	/**
	 * 查询订单下指定状态的图片
	 */
	public List<DecorationPicturePO> queryDecorationPictureForStatusByOrderIdAndStatus(String orderId, short status);

	/**
	 * 查询订单下展示中的图片（用于确认）
	 */
	public List<DecorationPicturePO> queryDecorationPictureForConfirmShowByOrderId(String orderId);

}
