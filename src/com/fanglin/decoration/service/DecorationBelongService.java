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
import com.fanglin.decoration.vo.DecorationBelongVO;

public interface DecorationBelongService {

	public List<DecorationBelongVO> queryDecorationBelong(DecorationBelongVO decorationBelongVO);

	public int sendDecorationBelong(DecorationBelongVO decorationBelongVO) throws FLException;

	public int confirmDecorationBelong(DecorationBelongVO decorationBelongVO) throws FLException;

	public int tranDecorationBelong(DecorationBelongVO decorationBelongVO, List<DecorationBelongVO> decorationBelongVOs) throws FLException;

}
