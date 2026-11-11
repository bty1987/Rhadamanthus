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
import com.fanglin.decoration.vo.DecorationBelongTranUserVO;
import com.fanglin.decoration.vo.DecorationBelongTranVO;
import com.fanglin.decoration.vo.DecorationBelongVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface DecorationBelongService {

	public List<DecorationBelongVO> queryDecorationBelong(DecorationBelongVO decorationBelongVO);

	public List<DecorationBelongTranUserVO> queryDecorationBelongForTran(String keyword, int company);

	public int pageDecorationForTranByBelonger(Paging paging, DecorationBelongVO decorationBelongVO, int company) throws FLException;

	public int sendDecorationBelong(DecorationBelongVO decorationBelongVO) throws FLException;

	public int confirmDecorationBelong(DecorationVO decorationVO, DecorationBelongVO decorationBelongVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException;

	public int tranDecorationBelong(DecorationBelongVO decorationBelongVO, List<DecorationBelongVO> decorationBelongVOs) throws FLException;

	public int mergeDecorationBelong(String orderId, Short type, String userId) throws FLException;

	public int confirmMergeDecorationBelong(String orderId, Short type, String userId, Long ccid) throws FLException;

}
