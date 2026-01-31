package com.fanglin.construction.service.impl;

import java.sql.Timestamp;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.MessageQueuingPO;
import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.dao.ConstructionInfoDao;
import com.fanglin.construction.dao.ConstructionNodeDao;
import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.dao.SystemConfigDao;
import com.fanglin.construction.po.ConstructionInfoPO;
import com.fanglin.construction.po.ConstructionNodePO;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.construction.vo.DrawLineVO;
import com.fanglin.construction.vo.ConstructionNodeVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.DateUtil;

/**
 * finishDrawLine 方法实现
 * 
 * 功能：直接完成开工，跳过放线流程
 * 
 * 与 successDrawLine 的区别：
 * 1. 不判断放线状态（STATUS_APPLICATION_INT）
 * 2. 不验证 DrawLinePO 是否存在（查询而非必需）
 * 3. 创建/更新所有施工计划（执行 successDrawLine 的完整逻辑）
 */
public class FinishDrawLineImplementation {

    public static int finishDrawLine(
            DrawLineDao drawLineDao,
            DecorationDao decorationDao,
            ConstructionDao constructionDao,
            ConstructionInfoDao constructionInfoDao,
            ConstructionNodeDao constructionNodeDao,
            ConstructionScheduleDao constructionScheduleDao,
            SystemConfigDao systemConfigDao,
            DrawLineVO drawLineVO,
            String userId) throws FLException {

        // 1. 直接查询装修单
        DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(drawLineVO.getDecoration().getOrderId());

        if (decorationPO == null) {
            throw new FLException(130014, "装修不存在");
        }

        String orderId = decorationPO.getOrderId();

        // 2. 查询已有的工程信息（不创建）
        ConstructionPO constructionPO = constructionDao.queryConstructionByOrderId(orderId);

        if (constructionPO == null) {
            throw new FLException(120020, "工程信息不存在，请先放线");
        }

        long cid = constructionPO.getCid();

        // 3. 查询工程信息
        ConstructionInfoPO constructionInfoPO = constructionInfoDao.queryConstructionInfoByOrderId(orderId);

        if (constructionInfoPO == null) {
            throw new FLException(120020, "工程信息不存在");
        }

        // 4. 获取所有施工节点
        List<ConstructionNodePO> constructionNodePOs = constructionNodeDao.queryConstructionNodeList();

        if (constructionNodePOs == null || constructionNodePOs.size() == 0) {
            throw new FLException(120020, "施工节点不存在");
        }

        // 5. 执行 successDrawLine 的完整逻辑（创建/更新施工计划）
        int timelimit = 0;
        SystemConfigPO salaryLimitTotal = systemConfigDao.querySystemConfig("WORKER_SALARY_LIMIT_TOTAL_INT", decorationPO.getCompany());
        Timestamp drawlineTime = constructionInfoPO.getDrawlineTime() == null ? DateUtil.getDateToTimestamp(new Date()) : constructionInfoPO.getDrawlineTime();

        for (ConstructionNodePO constructionNodePO : constructionNodePOs) {

            if (constructionNodePO.getTimeLimit() == null) {
                constructionNodePO.setTimeLimit(0);
            }

            int prenum = constructionNodePO.getPrenum() != null ? constructionNodePO.getPrenum() : 0;
            int postnum = constructionNodePO.getPostnum() != null ? constructionNodePO.getPostnum() : 0;

            Timestamp startTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div(timelimit + prenum, 1000000)));
            Timestamp endTime = DateUtil.getDateToTimestamp(DateUtil.plusDay(DateUtil.getTimestampToDate(drawlineTime), Arith.div((timelimit + prenum - 1000 + constructionNodePO.getTimeLimit()), 1000000)));

            ConstructionSchedulePO constructionSchedulePO = constructionScheduleDao.queryConstructionScheduleByCid(cid, constructionNodePO.getCnid());

            if (constructionSchedulePO != null) {
                // 更新已有施工计划
                constructionSchedulePO.setPreStartTime(startTime);
                constructionSchedulePO.setPreEndTime(endTime);
                constructionSchedulePO.setStartTime(startTime);
                constructionSchedulePO.setEndTime(endTime);
                constructionSchedulePO.setPrenum(prenum);
                constructionSchedulePO.setPostnum(postnum);
                constructionSchedulePO.setPeriod(constructionNodePO.getTimeLimit() != null ? constructionNodePO.getTimeLimit() : 0);
                constructionScheduleDao.update(constructionSchedulePO);
            } else {
                // 创建新的施工计划（successDrawLine 的逻辑）
                constructionSchedulePO = new ConstructionSchedulePO(cid, orderId, startTime, endTime, constructionNodePO.getSort(), constructionNodePO.getTimeLimit(), prenum, postnum).init(constructionNodePO);
                constructionSchedulePO.setSalaryLimitTotal(salaryLimitTotal == null ? 5000000 : Integer.valueOf(salaryLimitTotal.getValue()));
                constructionScheduleDao.save(constructionSchedulePO);
            }

            timelimit = timelimit + prenum + (constructionNodePO.getTimeLimit() != null ? constructionNodePO.getTimeLimit() : 0) + postnum;

            constructionPO.setPreStartTime(drawlineTime);
            constructionPO.setPreEndTime(endTime);
            constructionPO.setPeriod(DateUtil.diffDay(drawlineTime, endTime));
        }

        constructionDao.update(constructionPO);

        // 6. 设置放线状态为成功（如果存在）
        DrawLinePO drawLinePO = drawLineDao.queryDrawLineByOrderId(orderId);
        if (drawLinePO != null) {
            drawLinePO.setStatus(DrawLinePO.STATUS_SUCCESS_INT);
            drawLineDao.update(drawLinePO);
        }

        // 7. 更新装修单工程状态
        if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_INITIAL_INT) {
            decorationPO.setProjectStatus(DecorationPO.PROJECTSTATUS_START_INT);
            decorationDao.update(decorationPO);
        }

        // 8. 生成消息队列数据
        MessageQueuingPO messageQueuingPO = new MessageQueuingPO();
        messageQueuingPO.setOrderId(orderId);
        messageQueuingPO.setType("finishDrawLine");
        messageQueuingPO.setStatus(1);
        messageQueuingPO.setContent("{\"orderId\":\"" + orderId + "\",\"status\":\"1\",\"userId\":\"" + userId + "\",\"event\":\"DRAWLINE_FINISHED\"" + (decorationPO.getBusitype() != null ? ",\"busitypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}");
        messageQueuingPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
        
        return 0;
    }
}
