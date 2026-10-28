package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.PointAccountVO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.utils.Paging;

public interface PointAccountService {

	public void pagePointAccount(Paging paging, List<Filter> filters);

	public PointAccountVO queryPointAccount(PointAccountVO pointAccountVO);

	public PointAccountVO createPointAccount(PointAccountVO pointAccountVO, int company, String userId) throws FLException;

	public PointAccountVO updatePointAccountForOperatePoint(PointAccountVO pointAccountVO, String userId) throws FLException;

	public PointAccountVO grantPoint(PointAccountVO pointAccountVO, String userId) throws FLException;

	public PointAccountVO consumePoint(PointAccountVO pointAccountVO, String userId) throws FLException;

	/**
	 * 主材可用积分校验(预付款提现闸): 该单积分账户spoint>0时主材积分权益未结清, 抛150101不可提现;
	 * spoint<=0(含无积分账户/负值)视为符合放行。调用方: approval审批提现双闸 + payment直提withdrawPayment。
	 */
	public void checkMaterialPointForWithdraw(DecorationPO decorationPO) throws FLException;

}
