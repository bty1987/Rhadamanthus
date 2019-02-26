/**
 * @File Name		: OrderDesignPictureService
 * @Package   	: com.fanglin.service.decoration;
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
import com.fanglin.decoration.vo.DecorationPictureVO;

public interface DecorationPictureService {

	public List<DecorationPictureVO> queryDecorationPictureByOrderId(DecorationPictureVO decorationPictureVO);

	public int addDecorationPicture(DecorationPictureVO decorationPictureVO, String userId, int company) throws FLException;

	public int deleteDecorationPicture(DecorationPictureVO decorationPictureVO);

}
