/**
 * @File Name		: EsignFlowPatrolJob.java
 * @Package 		: com.fanglin.decoration.job
 * @Version			: 1.0
 * @Date			: 2026-10-22
 * @Describing		: e签宝卡流巡检兜底任务（每小时 23 分）
 *
 *  背景：
 *    e签宝签署流依赖 autoFinish 自动归档，历史上因字段误传（autoArchived）与网络抖动，
 *    出现"双方签署完成但流仍卡签署中"的卡单（须发起方手动调 finish 才能归档出证）。
 *    本任务为二道防线：扫描超时未收口的 e签宝合同，逐单判定"全部签署完成且流未完结"
 *    才调 finish，其余一律不动（不碰 ERP 合同状态——affix/filing 仍由业务操作驱动）。
 *
 *  扫描范围：
 *    provider=e签宝、状态 0初始/1已签、创建超过 esignFlowPatrolHours（默认 48 小时），
 *    单次最多 50 单（esignFlowPatrolLimit 可配），防大表拖垮。
 */

package com.fanglin.decoration.job;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.fanglin.decoration.dao.DecorationContractDao;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.SystemConfig;

@Component
public class EsignFlowPatrolJob {

	private static final Logger logger = LoggerFactory.getLogger(EsignFlowPatrolJob.class);

	/** 待兜底状态：0初始（签署中） / 1已签（待归档） */
	private static final List<Short> PATROL_STATUS = Arrays.asList(new Short[] { DecorationContractPO.STATUS_VALID_INT, DecorationContractPO.STATUS_SIGN_INT });

	@Autowired
	private DecorationContractDao decorationContractDao;

	@Autowired
	private ElecsignRouter elecsignRouter;

	/**
	 * 每小时 23 分巡检一次（避开整点任务高峰）。
	 *
	 * <p>判定与完结都在厂商实现内（finishSignedFlow）：非流ID/查不到/有人未签/已完结
	 * 一律静默跳过，只有真卡单才调 finish。单单异常互相隔离，不中断整轮。
	 */
	@Scheduled(cron = "0 23 * * * ?")
	public void patrolStuckFlows() {

		try {
			int patrolHours = SystemConfig.getInt("esignFlowPatrolHours", 48);
			int limit = SystemConfig.getInt("esignFlowPatrolLimit", 50);

			Timestamp deadline = DateUtil.getDateToTimestamp(new Date(System.currentTimeMillis() - patrolHours * 60L * 60 * 1000));

			List<DecorationContractPO> decorationContractPOs = decorationContractDao.queryDecorationContractForFlowPatrol(ElecsignProvider.ESIGN.code(), PATROL_STATUS, deadline, limit);

			int finished = 0;

			for (DecorationContractPO decorationContractPO : decorationContractPOs) {
				try {
					if (elecsignRouter.route(decorationContractPO.getProvider()).finishSignedFlow(decorationContractPO)) {
						finished++;
						logger.info("[esign-flow-patrol] 卡流已完结 dcid={} flowId={}", decorationContractPO.getDcid(), decorationContractPO.getFlowId());
					}
				} catch (Exception e) {
					logger.warn("[esign-flow-patrol] 单单异常 dcid={} flowId={} err={}", decorationContractPO.getDcid(), decorationContractPO.getFlowId(), e.getMessage());
				}
			}

			logger.info("[esign-flow-patrol] 本轮扫描={} 完结={}", decorationContractPOs.size(), finished);
		} catch (Exception e) {
			logger.error("[esign-flow-patrol] 巡检任务异常", e);
		}
	}

}
