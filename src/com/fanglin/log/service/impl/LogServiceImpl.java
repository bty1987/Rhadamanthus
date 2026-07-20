/**
 * @File Name		: LogServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.log.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.ActionLogDao;
import com.fanglin.log.po.ActionLogPO;
import com.fanglin.log.service.LogService;
import com.fanglin.log.vo.LogVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Service("logService")
@Transactional(readOnly=true)
public class LogServiceImpl implements LogService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private ActionLogDao actionLogDao;

	@Autowired
	private UserDao userDao;

	/**
	 * 自身代理引用，用于 REQUIRES_NEW 事务的正确发起。
	 * Spring 4.3+ 允许自注入，避免 this 调用绕过代理导致事务失效。
	 */
	@Autowired
	private LogService selfLogService;

	@Transactional(rollbackFor=Exception.class)
	public int addActionLog(LogVO logVO){

		ActionLogPO actionLogPO = new ActionLogPO();
		BeanUtil.copyProperties(logVO, actionLogPO);

		UserPO userPO = userDao.queryUserByUserId(logVO.getCreateUserId());

		actionLogPO.setCreateUserPO(userPO);

		actionLogDao.save(actionLogPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addActionLog(ActionLogPO actionLogPO){

		actionLogDao.save(actionLogPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addLog(LogVO logVO){
		addActionLog(logVO);
		return 0;
	}

	/**
	 * 安全写入 actionLog。
	 *
	 * <p>Phase 1 引入：被 AccessInterceptor 在请求结束时调用。设计要点：
	 * <ol>
	 *   <li>读 SystemConfig 的 actionLog.enable 开关；关则直接返回；</li>
	 *   <li>按 actionLog.sampling 采样率（0~100）随机决定是否落库；</li>
	 *   <li>使用 {@link Propagation#REQUIRES_NEW} 开新事务，独立于业务事务提交——
	 *       这样即使业务回滚，失败日志也能独立落库（业务失败必须留痕）；</li>
	 *   <li>任何异常 catch 后仅 logger.error，不向上抛，绝不影响主流程。</li>
	 * </ol>
	 *
	 * <p>关于自调用与代理：REQUIRES_NEW 必须通过 Spring 代理才能生效，
	 * 同类内 this.xxx() 调用绕过代理，事务注解失效。这里通过注入自身代理
	 * （selfLogService）来发起调用，是 Spring 4.3+ 标准做法。
	 */
	@Override
	public int safeAddActionLog(ActionLogPO actionLogPO){

		// 开关校验
		if (!SystemConfig.getBoolean("actionLog.enable", true)) return 0;

		// 采样率：0~100，100=全采，0=不采
		int sampling = SystemConfig.getInt("actionLog.sampling", 100);
		if (sampling <= 0) return 0;
		if (sampling < 100 && ThreadLocalRandom.current().nextInt(100) >= sampling) return 0;

		try {
			return selfLogService.doAddInNewTx(actionLogPO);
		} catch (Throwable t) {
			// 关键：吞掉所有异常，绝不影响主业务
			logger.error("[actionLog] write failed action={} user={}", actionLogPO.getActionName(), actionLogPO.getCreateUserPO() == null ? null : actionLogPO.getCreateUserPO().getUserId(), t);
			return -1;
		}
	}

	/**
	 * 在独立事务中执行实际写入，通过 REQUIRES_NEW 与业务事务隔离。
	 *
	 * <p>必须放在独立方法里，否则 Spring 的事务代理无法生效（同类内 this 调用
	 * 不走代理）。本方法不直接被外层调用，仅供 safeAddActionLog 通过 selfLogService
	 * 代理后调用。
	 */
	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW, rollbackFor = Exception.class)
	public int doAddInNewTx(ActionLogPO actionLogPO){
		return addActionLog(actionLogPO);
	}
	
	@Override
	public void pageActionLog(Paging paging, List<Filter> filters){
		List<LogVO> logVOs = new ArrayList<LogVO>();
		List<ActionLogPO> actionLogPOs = actionLogDao.getPageActionLogPOs(paging, filters);
		
		for(ActionLogPO actionLogPO: actionLogPOs){
			LogVO logVO = changeActionLogPOToVO(actionLogPO);
			logVOs.add(logVO);
		}
		
		paging.setData(logVOs);
	}

	@Override
	public List<LogVO> getAllPageActionLogs(List<Filter> filters){
		
		List<LogVO> logVOs = new ArrayList<LogVO>();
		List<ActionLogPO> actionLogPOs = actionLogDao.getAllPageActionLogPOs(filters);
		
		for(ActionLogPO actionLogPO: actionLogPOs){
			LogVO logVO = changeActionLogPOToVO(actionLogPO);
			logVOs.add(logVO);
		}
		return logVOs;
	}
	
	private LogVO changeActionLogPOToVO(ActionLogPO actionLogPO){
		LogVO logVO = new LogVO();

		BeanUtil.copyProperties(actionLogPO, logVO);
		logVO.setCreateUserId(actionLogPO.getCreateUserPO().getUserId());
		logVO.setCreateUserName(actionLogPO.getCreateUserPO().getCurrentName());
		logVO.setDuty(actionLogPO.getCreateUserPO().getDuty().getName());
		logVO.setRoleId(actionLogPO.getCreateUserPO().getRole().getNo());
		logVO.setRoleName(actionLogPO.getCreateUserPO().getRole().getName());

		// Phase 1 扩展字段（BeanUtil 已能按同名拷贝，这里显式补以防 BeanUtil 配置差异）
		logVO.setIp(actionLogPO.getIp());
		logVO.setCompanyId(actionLogPO.getCompanyId());
		logVO.setModuleId(actionLogPO.getModuleId());
		logVO.setOperateType(actionLogPO.getOperateType());
		logVO.setBusinessId(actionLogPO.getBusinessId());
		logVO.setParams(actionLogPO.getParams());
		logVO.setResultState(actionLogPO.getResultState());
		logVO.setErrorCode(actionLogPO.getErrorCode());
		logVO.setErrorMsg(actionLogPO.getErrorMsg());
		logVO.setTraceId(actionLogPO.getTraceId());

		return logVO;
	}

}
