package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.DecorationVO;
import com.fanglin.data.common.vo.TalkingVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Paging;

public interface DecorationService {

	public void queryCusDecorationUser(Paging paging, List<Filter> filters, DecorationVO decorationVO);

	public Object queryCusDecoration(DecorationVO decorationVO, String unionId);

	public DecorationVO queryDecoration(DecorationVO decorationVO);

	public DecorationVO queryCusDecorationByOrderId(DecorationVO decorationVO);

	public DecorationVO queryCusDecorationForDefault(String unionId) throws FLException;

	public String vodeCusDecoration(DecorationVO decorationVO) throws FLException;

	public int bindingCusDecoration(DecorationVO decorationVO, String unionId, String securityCode, String verifyCode) throws FLException;

	public int updateCusDecorationForDefault(DecorationVO decorationVO, String unionId) throws FLException;

	public int sendMessage(String orderId, String name, String content);

	public int sendMessage(String orderId, String name, String content, String path);

	public int sendMessage(String orderId, String name, String content, String path, UserPO creater);

	public int sendMessage(String key, String orderId, String name, String content, String path, UserPO creater);

	public List<TalkingVO> queryTalking(DecorationVO decorationVO, TalkingVO talkingVO);

}
