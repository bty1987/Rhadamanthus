package com.fanglin.log.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.vo.LoginLogVO;
import com.fanglin.utils.Paging;

public interface LoginLogService {

	public int addLoginLog(LoginLogVO loginLog);

	public void pageLoginLog(Paging paging, List<Filter> filters);

	public int isCanLogin(LoginLogVO lv);

	/**
	 * Phase 8: 原子化"检查防爆破 + 写入登录日志"。
	 *
	 * <p>把原来分散在两处的 isCanLogin + addLoginLog 合并为同一事务，
	 * 内部用 SELECT ... FOR UPDATE 悲观锁串行化，彻底解决并发安全问题：
	 * 并发的 N 个登录请求会依次进入此方法，第二个请求会阻塞在行锁上，
	 * 直到前一个事务提交（写入了失败记录），它才能读到最新的失败次数。
	 *
	 * <p>调用方传入 loginLogVO（含 loginId/sourceIp/loginTime/operateType），
	 * 以及最终是否成功 success（true 成功 / false 失败）和失败时的错误码信息。
	 *
	 * @param loginLogVO 登录上下文（loginId/sourceIp/loginTime/operateType）
	 * @param success 本次登录是否成功
	 * @param errorCode 失败时的 FLException 错误码（成功时传 null）
	 * @param errorMsg 失败时的错误消息（成功时传 null）
	 * @return 剩余可尝试次数；-1 表示已被防爆破锁定（拒绝登录）
	 */
	public int recordLogin(LoginLogVO loginLogVO, boolean success, Integer errorCode, String errorMsg);

}

