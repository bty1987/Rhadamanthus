package com.fanglin.decoration.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationPictureDao;
import com.fanglin.decoration.dao.impl.DecorationServiceDaoImpl;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.decoration.po.DecorationServiceDO;
import com.fanglin.decoration.po.DecorationServicePO;
import com.fanglin.decoration.service.DecorationServiceService;
import com.fanglin.decoration.vo.DecorationPictureVO;
import com.fanglin.decoration.vo.DecorationServiceVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("decorationServiceService")
@Transactional(readOnly = true)
public class DecorationServiceServiceImpl implements DecorationServiceService {

	@Autowired
	private DecorationServiceDaoImpl decorationServiceDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private DecorationPictureDao decorationPictureDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageDecorationService(Paging paging, java.util.List<Filter> filters, Authentication authentication) throws FLException {

		if (filters.size() == 0) return;

		// 调用DAO层进行分页查询
		List<DecorationServiceDO> decorationServiceDOs = decorationServiceDao.pageDecorationService(paging, filters, authentication.getCompany());
		List<DecorationServiceVO> decorationServiceVOs = new ArrayList<DecorationServiceVO>();

		// PO转VO
		for (DecorationServiceDO decorationServiceDO : decorationServiceDOs) {
			decorationServiceVOs.add(decorationServiceDO.ptv(new DecorationServiceVO(new DecorationVO(), new UserBaseVO(new DutyVO()))));
		}

		// 设置分页数据
		paging.setData(decorationServiceVOs);
	}

	@Override
	public List<DecorationServiceVO> queryDecorationServiceByOrderId(DecorationServiceVO decorationServiceVO) {

		List<DecorationServicePO> decorationServicePOs = decorationServiceDao.queryDecorationServiceByOrderId(decorationServiceVO.getOrderId());
		List<DecorationServiceVO> decorationServiceVOs = new ArrayList<DecorationServiceVO>();

		for (DecorationServicePO decorationServicePO : decorationServicePOs) {
			decorationServiceVOs.add(decorationServicePO.ptv(new DecorationServiceVO(new UserBaseVO(new DutyVO()))));
		}

		return decorationServiceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecortionService(DecorationServiceVO decorationServiceVO, Authentication authentication) {

		String userId = authentication.getUserId();

		UserPO operater = userDao.queryUserByUserId(userId);

		DecorationServicePO decorationServicePO = new DecorationServicePO();

		BeanUtil.copyProperties(decorationServiceVO, decorationServicePO);
		decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_INIT_INT);
		decorationServicePO.setOperater(operater);
		decorationServicePO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		decorationServicePO.setComment("");
		decorationServicePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		// 计算超期天数：根据type获取最近一次的服务记录，累积超期天数
		int overdueDays = 0;
		if (decorationServicePO.getType() > 0) {
			DecorationServicePO latestService = decorationServiceDao.queryDecorationService(decorationServicePO.getOrderId(), decorationServicePO.getType());
			if (latestService != null && latestService.getCreateTime() != null) {
				Timestamp latestCreateTime = latestService.getCreateTime();
				Timestamp currentTime = DateUtil.getDateToTimestamp(new Date());
				int daysDiff = DateUtil.diffDay(latestCreateTime, currentTime);
				if (daysDiff > 0) {
					overdueDays = latestService.getOverdueDays() + daysDiff;
				} else {
					overdueDays = latestService.getOverdueDays();
				}
			}
		}
		decorationServicePO.setOverdueDays(overdueDays);

		decorationServiceDao.save(decorationServicePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int completeDecorationService(DecorationServiceVO decorationServiceVO) throws FLException {

		DecorationServicePO decorationServicePO = decorationServiceDao.get(decorationServiceVO.getDsid());

		if (decorationServicePO == null) {
			throw new FLException(140055, "装修服务不存在");
		}

		if (decorationServicePO.getStatus() != DecorationServicePO.SERVICESTATUS_INIT_INT) {
			throw new FLException(140056, "装修服务不可操作");
		}

		decorationServicePO.setStatus(DecorationServicePO.SERVICESTATUS_FINISH_INT);
		decorationServicePO.setComment(decorationServiceVO.getComment());

		decorationServiceDao.saveOrUpdate(decorationServicePO);

		return 0;
	}

	// ==================== 设计确认相关方法实现 ====================

	@Override
	@Transactional(rollbackFor = Exception.class)
	public long createDesignConfirmationForPictureByOrderId(DecorationServiceVO serviceVO, Authentication authentication) throws FLException {
		String orderId = serviceVO.getOrderId();

		// 1. 获取下一轮次号
		int roundNumber = decorationServiceDao.getNextRoundForDesignConfirmByOrderId(orderId);

		// 2. 查询标记为"本次确认展示"的图片
		List<DecorationPicturePO> showPictures = decorationPictureDao.queryDecorationPictureForConfirmShowByOrderId(orderId);

		if (showPictures.isEmpty()) {
			throw new FLException("请先选择需要确认的图片");
		}

		// 3. 构建args JSON
		List<Long> dpids = new ArrayList<Long>();
		for (DecorationPicturePO pic : showPictures) {
			dpids.add(pic.getDpId());
		}

		Map<String, Object> argsMap = new HashMap<String, Object>();
		argsMap.put("dpids", dpids);
		argsMap.put("pictureCount", dpids.size());
		String argsJson = JSON.toJSONString(argsMap);

		// 4. 创建 decorationservice 记录
		DecorationServicePO servicePO = new DecorationServicePO();
		servicePO.setOrderId(orderId);
		servicePO.setName("设计确认(第" + roundNumber + "轮)");
		servicePO.setDetail("待客户确认");
		servicePO.setType(DecorationServicePO.TYPE_DESIGN_CONFIRM);
		servicePO.setStatus(DecorationServicePO.SERVICESTATUS_INIT_INT);
		servicePO.setArgs(argsJson);
		servicePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		UserPO operater = userDao.queryUserByUserId(authentication.getUserId());
		servicePO.setOperater(operater);

		decorationServiceDao.save(servicePO);

		// 5. 更新订单状态为完成-待确认
		decorationDao.updateDesignStatus(orderId, (short) 2);

		return servicePO.getDsid();
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void submitDesignConfirmationForResultByDsid(DecorationServiceVO serviceVO, Authentication authentication) throws FLException {
		Long dsid = serviceVO.getDsid();
		Short result = serviceVO.getConfirmResult();
		String remark = serviceVO.getComment();

		// 1. 获取确认记录
		DecorationServicePO servicePO = decorationServiceDao.get(dsid);
		if (servicePO == null) {
			throw new FLException("确认记录不存在");
		}

		// 2. 解析原有args，添加确认结果
		String argsJson = servicePO.getArgs();
		Map<String, Object> argsMap = JSON.parseObject(argsJson, Map.class);
		argsMap.put("result", result);
		argsMap.put("remark", remark);
		servicePO.setArgs(JSON.toJSONString(argsMap));

		// 3. 更新确认记录状态
		servicePO.setStatus(DecorationServicePO.SERVICESTATUS_FINISH_INT);
		servicePO.setComment(remark);
		servicePO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		// 4. 更新详情描述
		String resultText = getResultText(result);
		servicePO.setDetail("客户确认: " + resultText);

		UserPO finisher = userDao.queryUserByUserId(authentication.getUserId());
		servicePO.setFinisher(finisher);

		decorationServiceDao.update(servicePO);

		// 5. 根据结果更新订单设计状态
		short newDesignStatus;
		switch (result) {
			case 2: // 完成
				newDesignStatus = 3;
				break;
			case 4: // 微改
				newDesignStatus = 5;
				break;
			case 6: // 大改
				newDesignStatus = 7;
				break;
			default:
				newDesignStatus = 3;
		}
		decorationDao.updateDesignStatus(servicePO.getOrderId(), newDesignStatus);

		// 6. 清除图片的确认展示状态
		decorationPictureDao.clearDecorationPictureForConfirmShowByOrderId(servicePO.getOrderId());
	}

	@Override
	public List<DecorationServiceVO> queryDesignConfirmationHistoryForByOrderId(String orderId) {
		List<DecorationServicePO> list = decorationServiceDao.queryDecorationServiceForDesignConfirmByOrderId(orderId);
		List<DecorationServiceVO> result = new ArrayList<DecorationServiceVO>();

		for (DecorationServicePO po : list) {
			DecorationServiceVO vo = new DecorationServiceVO();
			po.ptv(vo);

			// 解析args获取图片列表
			if (po.getArgs() != null) {
				Map<String, Object> argsMap = JSON.parseObject(po.getArgs(), Map.class);
				List<Integer> dpids = (List<Integer>) argsMap.get("dpids");
				if (dpids != null && !dpids.isEmpty()) {
					List<DecorationPictureVO> pictures = new ArrayList<DecorationPictureVO>();
					for (Integer dpid : dpids) {
						DecorationPicturePO pic = decorationPictureDao.get(dpid.longValue());
						if (pic != null) {
							DecorationPictureVO picVO = new DecorationPictureVO();
							pic.ptv(picVO);
							pictures.add(picVO);
						}
					}
					vo.setPictures(pictures);
				}
				// 设置确认结果
				Integer result = (Integer) argsMap.get("result");
				if (result != null) {
					vo.setConfirmResult(result.shortValue());
				}
			}

			result.add(vo);
		}

		return result;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void toggleDecorationPictureForShowStatusByOrderIdAndDpid(String orderId, Long dpid, short status) throws FLException {
		DecorationPicturePO picture = decorationPictureDao.get(dpid);
		if (picture == null) {
			throw new FLException("图片不存在");
		}

		// 如果设置为"本次确认展示"，先清除其他图片的展示状态
		if (status == DecorationPicturePO.STATUS_CONFIRM_SHOW_INT) {
			decorationPictureDao.clearDecorationPictureForConfirmShowByOrderId(orderId);
		}

		picture.setStatus(status);
		decorationPictureDao.update(picture);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchToggleDecorationPictureForShowStatusByOrderIdAndDpids(String orderId, String dpidStr, short status) throws FLException {
		if (dpidStr == null || dpidStr.trim().isEmpty()) {
			return 0;
		}

		// 解析图片ID列表
		String[] dpidArr = dpidStr.split(",");
		List<Long> dpids = new ArrayList<Long>();
		for (String dpid : dpidArr) {
			try {
				dpids.add(Long.parseLong(dpid.trim()));
			} catch (NumberFormatException e) {
				// 忽略无效的ID
			}
		}

		if (dpids.isEmpty()) {
			return 0;
		}

		// 使用带清除逻辑的批量更新
		return decorationPictureDao.batchUpdateDecorationPictureForStatusByOrderIdAndDpids(orderId, dpids, status);
	}

	/**
	 * 获取确认结果文本
	 */
	private String getResultText(short result) {
		switch (result) {
			case 2: return "完成";
			case 4: return "微改";
			case 6: return "大改";
			default: return "未知";
		}
	}

}
