/**
 * @File Name		: OrderDesignPictureService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.OrderDesignPictureVO;

public interface OrderDesignPictureService {
	
	public List<OrderDesignPictureVO> queryOrderDesignPictureByOrderId(OrderDesignPictureVO orderDesignPictureVO);

	public List<OrderDesignPictureVO> queryOrderDesignPictureForCADByOrderId(OrderDesignPictureVO orderDesignPictureVO);
	
	public int addOrderDesignPicture(OrderDesignPictureVO orderDesignPicture) throws FLException;
	
	public int addOrderDesignPictureForCAD(OrderDesignPictureVO orderDesignPicture);

	public int deleteOrderDesignPictureByIdAndOrderId(OrderDesignPictureVO orderDesignPicture) throws FLException;

}
