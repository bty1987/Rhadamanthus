/**
 * @File Name		: DecorationBackVisitService
 * @Package   	: com.fanglin.decoration.service
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
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationBackVisitVO;
import com.fanglin.utils.Paging;

public interface DecorationBackVisitService {

	public void pageDecorationBackVisitByOrderId(Paging paging, List<Filter> filters, DecorationBackVisitVO backVisitVO);

	public List<DecorationBackVisitVO> queryDecorationBackVisitByOrderId(DecorationBackVisitVO backVisitVO);

	public void addDecorationBackVisit(DecorationBackVisitVO backVisitVO, String userId, int company) throws FLException;

	public void deleteDecorationBackVisitById(DecorationBackVisitVO orderDesignPicture);

}
