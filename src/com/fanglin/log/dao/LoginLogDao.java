package com.fanglin.log.dao;

import java.sql.Timestamp;
import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.LoginLogPO;
import com.fanglin.utils.Paging;

public interface LoginLogDao extends Dao<LoginLogPO> {

	public List<LoginLogPO> getPageLoginLog(Paging paging, List<Filter> filters);

	public void delteBeforLoginTime(Timestamp beforeTime);

	public List<LoginLogPO> getLoginLogByLoginIdAndStartEndTime(String loginId, Timestamp start, Timestamp end);

	/**
	 * Phase 8: 悲观锁查询，用于防爆破逻辑串行化。
	 *
	 * <p>使用 SELECT ... FOR UPDATE 对时间窗口内的记录加行锁，
	 * 并发的登录请求会阻塞在此查询上，直到前一个事务提交，
	 * 从而保证"检查失败次数 + 写入新记录"是原子操作。
	 */
	public List<LoginLogPO> getLoginLogForUpdateByLoginId(String loginId, Timestamp start, Timestamp end);
}
