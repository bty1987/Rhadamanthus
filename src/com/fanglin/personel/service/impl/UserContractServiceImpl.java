/**
 * Title: UserContractServiceImpl
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.personel.dao.UserContractDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserContractPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.UserContractService;
import com.fanglin.personel.vo.UserContractVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("userContractService")
@Transactional(readOnly = true)
public class UserContractServiceImpl implements UserContractService {

	@Autowired
	private UserContractDao userContractDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private ElecsignService elecsignService;

	@Override
	public List<UserContractVO> queryUserContract(UserContractVO userContractVO) {

		List<UserContractPO> userContractPOs = userContractDao.queryUserContract(userContractVO.getUid());
		List<UserContractVO> userContractVOs = new ArrayList<UserContractVO>();

		for (UserContractPO userContractPO : userContractPOs) {

			userContractVO = new UserContractVO();

			BeanUtil.copyPropertie(userContractPO, userContractVO, Arrays.asList("creater", "signner"));

			userContractVOs.add(userContractVO);
		}

		return userContractVOs;
	}

	@Override
	public void sendUserContractForAuth(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

	}

	@Override
	public void sendUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

	}

	@Override
	public String redirectUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		UserPO userPO = userDao.get(userContractPO.getUid());

		String url = "";

		short type = userContractVO.getType();
		short status = userContractPO.getStatus();

		if (type == DecorationContractPO.TYPE_SIGNET_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
			url = String.format("%s/signature.html?cid=%d&type=2&module=personel", isv.getValue(), userPO.getUid());
		} else if (type == DecorationContractPO.TYPE_SIGN_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			url = elecsignService.extsign(userPO.getSignNo(), userContractPO);
		} else if (type == DecorationContractPO.TYPE_VIEW_INT && status == DecorationContractPO.STATUS_VALID_INT) {
			url = userContractPO.getViewpdf();
		} else if (type == DecorationContractPO.TYPE_DOWNLOAD_INT && status == DecorationContractPO.STATUS_SIGN_INT) {
			url = userContractPO.getDownload();
		} else {
			throw new FLException(130028, "合同状态不可操作");
		}

		return url;
	}

	@Override
	public String viewUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		return elecsignService.view(userContractPO);
	}

	@Override
	public String signUserContractForCompany(SignetVO signetVO, UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (userContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		elecsignService.autosign(signetVO.getSignno(), signetVO.getKeyword(), userContractPO, signetVO.getSignid());

		userContractPO.setComsignTime(DateUtil.getDateToTimestamp(new Date()));

		userContractDao.update(userContractPO);

		return "";
	}

	@Override
	public String signUserContractForUser(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (userContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		UserPO userPO = userDao.get(userContractPO.getUid());

		return elecsignService.extsign(userPO.getSignNo(), userContractPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addUserContract(UserContractVO userContractVO, ContractVO contractVO, String data, String userId) throws FLException {

		UserContractPO userContractPO = new UserContractPO();

		userContractPO.setUid(userContractVO.getUid());

		userContractPO.setCid(contractVO.getCid());
		userContractPO.setNo(contractVO.getNo());
		userContractPO.setName(contractVO.getName());
		userContractPO.setTitle(contractVO.getTitle());

		userContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		userContractPO.setCreater(userDao.queryUserByUserId(userId));

		userContractDao.save(userContractPO);

		JSONObject params = JSONObject.parseObject(data);

		elecsignService.generate(userContractPO, params, null);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		userContractPO.setName(userContractVO.getName());
		userContractPO.setSignTime(userContractVO.getSignTime());
		userContractPO.setStartTime(userContractVO.getStartTime());
		userContractPO.setEndTime(userContractVO.getEndTime());
		userContractPO.setStatus(userContractVO.getStatus());
		userContractPO.setComment(userContractVO.getComment());

		userContractDao.update(userContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affixUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (userContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		userContractPO.setStatus(UserContractPO.STATUS_SIGN_INT);

		userContractDao.update(userContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expireUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (userContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		userContractPO.setStatus(UserContractPO.STATUS_NULL_INT);

		userContractDao.update(userContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int filingUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(130002, "合同不存在");
		}

		if (userContractPO.getStatus() != UserContractPO.STATUS_SIGN_INT) {
			throw new FLException(130028, "合同不可操作");
		}

		userContractPO.setStatus(DecorationContractPO.STATUS_FILE_INT);

		userContractDao.update(userContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteUserContract(UserContractVO userContractVO) throws FLException {

		UserContractPO userContractPO = userContractDao.get(userContractVO.getUcid());

		if (userContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (userContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		userContractDao.delete(userContractPO);

		return 0;
	}

}
