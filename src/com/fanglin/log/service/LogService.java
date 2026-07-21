/**
 * @File Name		: DecorationContractService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.log.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.log.vo.LogVO;
import com.fanglin.utils.Paging;

public interface LogService {

	public List<LogVO> getAllPageActionLogs(List<Filter> filters);

	public void pageActionLog(Paging paging, List<Filter> filters);

	/**
	 * Phase 4.3: 查询热表 + 归档表的 UNION 结果（含历史数据）。
	 *
	 * <p>使用场景：前端"含历史"开关勾选时调用。本方法根据 filters 中的 createTime
	 * 时间范围计算涉及的归档月份表，对热表 + 这些归档表执行 UNION ALL 查询。
	 *
	 * <p>前置约束：filters 中必须包含 createTime between 条件（否则全表扫归档表无意义，
	 * 也会被 Service 层拒绝）。归档表不支持按 createUserPO.currentName（姓名）过滤，
	 * 业务侧应改用 createUserId（账号）。
	 */
	public void pageActionLogWithHistory(Paging paging, List<Filter> filters);

	public int addLog(LogVO logVO);

	public int addActionLog(ActionLogPO actionLogPO);

	/**
	 * 安全写入 actionLog，永不抛异常。
	 *
	 * <p>Phase 1 引入：供 AccessInterceptor 在请求结束时调用。其内部：
	 * <ol>
	 *   <li>校验 actionLog.enable 开关，关闭则直接返回；</li>
	 *   <li>按 actionLog.sampling 采样率决定是否落库；</li>
	 *   <li>调用 addActionLog(ActionLogPO) 写库，任何异常 catch 后仅打 logger.error，</li>
	 * </ol>
	 * 关键约束：本方法绝不能影响主业务事务，故 REQUIRED 传播但内部 try-catch 吞异常。
	 *
	 * @param actionLogPO 已填充完整的日志对象
	 * @return 0=未写（开关关或被采样跳过）；1=已写；-1=写失败（已吞异常）
	 */
	public int safeAddActionLog(ActionLogPO actionLogPO);

	/**
	 * 在 REQUIRES_NEW 事务中执行实际写入。仅供 safeAddActionLog 通过自身代理调用，
	 * 不直接暴露给业务侧。放接口里是为了让 Spring 代理能拦截到此方法。
	 */
	public int addActionLogInNewTransaction(ActionLogPO actionLogPO);

}
