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
	
}
