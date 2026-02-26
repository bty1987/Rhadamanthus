/**
 * @File Name		: OrderDesignPictureServiceImpl
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationPictureDao;
import com.fanglin.decoration.po.DecorationPicturePO;
import com.fanglin.decoration.service.DecorationPictureService;
import com.fanglin.decoration.vo.DecorationPictureVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationPictureService")
@Transactional(readOnly = true)
public class DecorationPictureServiceImpl implements DecorationPictureService {

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationPictureDao decorationPictureDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<DecorationPictureVO> queryDecorationPictureByOrderId(DecorationPictureVO decorationPictureVO) {

		List<DecorationPicturePO> decorationPicturePOs = decorationPictureDao.queryDecorationPictureByOrderId(decorationPictureVO.getOrderId());
		List<DecorationPictureVO> decorationPictureVOs = new ArrayList<DecorationPictureVO>();

		for (DecorationPicturePO decorationPicturePO : decorationPicturePOs) {
			decorationPictureVO = new DecorationPictureVO();

			BeanUtil.copyProperties(decorationPicturePO, decorationPictureVO, Arrays.asList("house", "customer", "designer", "salesman", "supervisor", "version", "createUser", "quoter", "escorter"));

			decorationPictureVO.setOrderId(decorationPicturePO.getOrderId());
			decorationPictureVO.setUserId(decorationPicturePO.getUserPO().getUserId());

			decorationPictureVOs.add(decorationPictureVO);
		}

		return decorationPictureVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addDecorationPicture(DecorationPictureVO decorationPictureVO, String userId, int company) throws FLException {

		int type = decorationPictureVO.getType();
		String orderId = decorationPictureVO.getOrderId();

		SystemConfigPO decorationPictureLimit = systemConfigDao.querySystemConfig(String.format("decorationpicturelimit%d", type), company);

		if (decorationPictureDao.countDecorationPicture(orderId, type) >= (decorationPictureLimit == null ? 3 : Integer.valueOf(decorationPictureLimit.getValue()))) {
			throw new FLException(110017, "资源数已达上限");
		}

		DecorationPicturePO decorationPicturePO = new DecorationPicturePO();

		BeanUtil.copyProperties(decorationPictureVO, decorationPicturePO, Arrays.asList("house", "customer", "designer", "salesman", "supervisor", "version", "createUser", "quoter", "escorter"));

		String name = decorationPictureVO.getName();
		String _name = name.split("\\.")[0];
		String _suffix = name.split("\\.")[1];

		decorationPicturePO.setUserPO(userDao.queryUserByUserId(userId));
		decorationPicturePO.setUploadTime(DateUtil.getDateToTimestamp(new Date()));
		decorationPicturePO.setName(String.format("%s.%s", _name.substring(0, _name.length() > 8 ? 8 : _name.length()), _suffix));
		decorationPicturePO.setStatus(DecorationPicturePO.STATUS_ENABLE_INT);
		decorationPicturePO.setFilesize(decorationPictureVO.getFilesize());

		decorationPictureDao.save(decorationPicturePO);

		decorationPictureVO.setDpId(decorationPicturePO.getDpId());
		decorationPictureVO.setUploadTime(decorationPicturePO.getUploadTime());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchDecorationPicture(List<DecorationPictureVO> decorationPictures) {

		if (decorationPictures == null || decorationPictures.isEmpty()) {
			return 0;
		}

		String orderId = null;
		Short status = null;
		List<Long> dpids = new ArrayList<Long>();

		// 收集 dpids、orderId 和 status
		for (DecorationPictureVO decorationPictureVO : decorationPictures) {
			if (decorationPictureVO.getDpId() == null) {
				continue;
			}
			dpids.add(decorationPictureVO.getDpId());

			if (orderId == null) {
				orderId = decorationPictureVO.getOrderId();
			}
			if (status == null && decorationPictureVO.getStatus() != null) {
				status = decorationPictureVO.getStatus();
			}
		}

		if (dpids.isEmpty() || orderId == null || status == null) {
			return 0;
		}

		// 如果设置为"本次确认展示"，先清除其他图片的确认展示状态
		if (status == DecorationPicturePO.STATUS_CONFIRM_SHOW_INT) {
			decorationPictureDao.clearDecorationPicture(orderId);
		}

		return decorationPictureDao.batchDecorationPicture(orderId, dpids, status);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteDecorationPicture(DecorationPictureVO decorationPictureVO) {

		DecorationPicturePO decorationPicturePO = decorationPictureDao.get(decorationPictureVO.getDpId());

		if (decorationPicturePO != null) {
			decorationPicturePO.setStatus(DecorationPicturePO.STATUS_DISABLE_INT);
		}

		return 0;
	}

}
