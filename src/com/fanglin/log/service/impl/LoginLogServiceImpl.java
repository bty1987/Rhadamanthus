package com.fanglin.log.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.log.dao.LoginLogDao;
import com.fanglin.log.po.LoginLogPO;
import com.fanglin.log.service.LoginLogService;
import com.fanglin.log.utils.ParamSanitizer;
import com.fanglin.log.vo.LoginLogVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;
import com.fanglin.utils.UUIDUtil;

@Service("loginLogService")
@Transactional(readOnly = true)
public class LoginLogServiceImpl implements LoginLogService {


	@Autowired
	private LoginLogDao loginLogDao;

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addLoginLog(LoginLogVO loginLog){

		LoginLogPO loginLogPO = buildPO(loginLog);

		Timestamp beforeTime = new Timestamp(DateUtil.getTimestampToDate(loginLogPO.getLoginTime()).getTime() - SystemConfig.getInt("recordLoginLogDay", 30) * 24 * 60*60*1000L);

		loginLogDao.delteBeforLoginTime(beforeTime);

		loginLogDao.save(loginLogPO);

		return 0;
	}

	@Override
	public void pageLoginLog(Paging paging, List<Filter> filters){
		List<LoginLogPO> loginLogPOs = loginLogDao.getPageLoginLog(paging, filters);
		List<LoginLogVO> loginLogVOs = new ArrayList<LoginLogVO>();

		for(LoginLogPO loginLogPO: loginLogPOs){
			LoginLogVO loginLogVO = new LoginLogVO();
			BeanUtil.copyProperties(loginLogPO, loginLogVO);

			loginLogVOs.add(loginLogVO);
		}

		paging.setData(loginLogVOs);
	}

	@Override
	public int isCanLogin(LoginLogVO loginLogVO){
		int res = 0;

		Timestamp startTime = new Timestamp(DateUtil.getTimestampToDate(loginLogVO.getLoginTime()).getTime() - SystemConfig.getInt("refuseLoginStatMin", 5) * 60 * 1000);

		List<LoginLogPO> loginLogPOs = loginLogDao.getLoginLogByLoginIdAndStartEndTime(loginLogVO.getLoginId(), startTime, loginLogVO.getLoginTime());

		int failCount = 0;
		for(LoginLogPO loginLogPO: loginLogPOs){
			if(loginLogPO.getSuccessFlag() == 0){
				failCount++;
			}else{
				break;
			}
		}

		if(failCount >= SystemConfig.getInt("refuseLoginTimes",5)){
			res = -1;
		}else{
			res = SystemConfig.getInt("refuseLoginTimes",5)-failCount;
		}
		return res;
	}

	/**
	 * Phase 8: 原子化"检查防爆破 + 写入登录日志"。
	 *
	 * <p>核心改造点：
	 * <ol>
	 *   <li>用 getLoginLogForUpdateByLoginId（FOR UPDATE 行锁）查失败次数，
	 *       并发请求会在此阻塞串行化；</li>
	 *   <li>检查通过后才写入新记录，保证"检查 + 写入"原子性；</li>
	 *   <li>loginId 入库前调 ParamSanitizer.maskLoginId 脱敏（手机号打码）；</li>
	 *   <li>同时写 successFlag（向后兼容）和 resultState（新三态字段）；</li>
	 *   <li>成功登录后不清理旧失败记录（保留审计轨迹），仅靠 break 语义保证计数正确。</li>
	 * </ol>
	 *
	 * <p>事务边界：本方法整体 @Transactional，FOR UPDATE 锁在事务提交时释放。
	 */
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int recordLogin(LoginLogVO loginLogVO, boolean success, Integer errorCode, String errorMsg){

		Timestamp loginTime = loginLogVO.getLoginTime() != null ? loginLogVO.getLoginTime() : DateUtil.getDateToTimestamp(new Date());

		// 防爆破统计窗口
		int statMin = SystemConfig.getInt("refuseLoginStatMin", 5);
		Timestamp startTime = new Timestamp(DateUtil.getTimestampToDate(loginTime).getTime() - statMin * 60 * 1000);

		// 关键：用 FOR UPDATE 查询，对时间窗口内的记录加行锁
		// 并发请求会阻塞在此，直到前一个事务提交
		List<LoginLogPO> recentLogs = loginLogDao.getLoginLogForUpdateByLoginId(
				loginLogVO.getLoginId(), startTime, loginTime);

		// 统计最近一次成功之后的连续失败次数
		int failCount = 0;
		for (LoginLogPO log : recentLogs){
			if (log.getSuccessFlag() == LoginLogPO.SUCCESSFLAG_FAIL){
				failCount++;
			} else {
				break; // 遇到成功记录就停止
			}
		}

		int threshold = SystemConfig.getInt("refuseLoginTimes", 5);

		// 判定是否被锁定（仅失败请求才检查，成功请求直接放行写入）
		if (!success && failCount >= threshold){
			// 已被锁定，不写入新记录（避免锁定期间日志膨胀），直接返回 -1
			return -1;
		}

		// 检查通过，写入登录日志
		loginLogVO.setLoginTime(loginTime);
		loginLogVO.setSuccessFlag(success ? LoginLogPO.SUCCESSFLAG_SUCCESS : LoginLogPO.SUCCESSFLAG_FAIL);
		loginLogVO.setResultState(success ? LoginLogPO.RESULTSTATE_SUCCESS : LoginLogPO.RESULTSTATE_FAIL);
		loginLogVO.setErrorCode(errorCode);
		loginLogVO.setErrorMsg(errorMsg);
		if (loginLogVO.getTraceId() == null){
			loginLogVO.setTraceId(UUIDUtil.getUuid());
		}

		LoginLogPO po = buildPO(loginLogVO);
		loginLogDao.save(po);

		// 返回剩余可尝试次数（成功时也返回，调用方可忽略）
		return success ? 0 : (threshold - failCount - 1);
	}

	/**
	 * 构造 PO，统一处理 loginId 脱敏 + id 置空（历史兼容）。
	 */
	private LoginLogPO buildPO(LoginLogVO loginLogVO){
		LoginLogPO po = new LoginLogPO();
		BeanUtil.copyProperties(loginLogVO, po);

		// Phase 8: loginId 脱敏（手机号打码），防止日志表沦为明文手机号池
		po.setLoginId(ParamSanitizer.maskLoginId(loginLogVO.getLoginId()));

		// 历史兼容：id 字段语义为空，强制置空字符串
		po.setId("");

		return po;
	}

}
