package com.fanglin.personel.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.data.common.vo.SupplierSignetVO;
import com.fanglin.decoration.po.DecorationContractPO;
import com.fanglin.elecsign.service.ElecsignService;
import com.fanglin.personel.dao.SupplierContractDao;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.SupplierContractPO;
import com.fanglin.personel.po.UserContractPO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.service.SupplierContractService;
import com.fanglin.personel.vo.SupplierContractVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("supplierContractService")
@Transactional(readOnly = true)
public class SupplierContractServiceImpl implements SupplierContractService {

	@Autowired
	private SupplierContractDao supplierContractDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ElecsignService elecsignService;

	@Override
	public List<SupplierContractVO> querySupplierContract(SupplierContractVO supplierContractVO) {

		List<SupplierContractPO> supplierContractPOs = supplierContractDao.querySupplierContract(supplierContractVO.getUid());
		List<SupplierContractVO> supplierContractVOs = new ArrayList<SupplierContractVO>();

		for (SupplierContractPO supplierContractPO : supplierContractPOs) {

			supplierContractVO = new SupplierContractVO();

			BeanUtil.copyPropertie(supplierContractPO, supplierContractVO, Arrays.asList("creater", "signner"));

			supplierContractVOs.add(supplierContractVO);
		}

		return supplierContractVOs;
	}

	@Override
	public SupplierContractVO querySupplierContractById(SupplierContractVO supplierContractVO) {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		BeanUtil.copyPropertie(supplierContractPO, supplierContractVO, Arrays.asList("creater", "signner"));

		return supplierContractVO;
	}

	@Override
	public String viewSupplierContract(SupplierContractVO supplierContractVO) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		return elecsignService.view(supplierContractPO);
	}

	@Override
	public String signSupplierContractForCompany(SignetVO signetVO, SupplierContractVO supplierContractVO) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (supplierContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		elecsignService.autosign(signetVO.getSignno(), signetVO.getKeyword(), supplierContractPO, signetVO.getSignid());

		supplierContractPO.setComsignTime(DateUtil.getDateToTimestamp(new Date()));

		supplierContractDao.update(supplierContractPO);

		return "";
	}

	@Override
	public String signSupplierContractForSupplier(SupplierSignetVO supplierSignetVO, SupplierContractVO supplierContractVO) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (supplierContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		return elecsignService.extsign(supplierSignetVO.getSignno(), supplierContractPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addSupplierContract(SupplierContractVO supplierContractVO, ContractVO contractVO, String userId) throws FLException {

		SupplierContractPO supplierContractPO = new SupplierContractPO();

		supplierContractPO.setUid(supplierContractVO.getUid());

		supplierContractPO.setCid(contractVO.getCid());
		supplierContractPO.setNo(contractVO.getNo());
		supplierContractPO.setName(contractVO.getName());
		supplierContractPO.setTitle(contractVO.getTitle());

		supplierContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		supplierContractPO.setCreater(userDao.queryUserByUserId(userId));

		supplierContractPO.setComment(supplierContractVO.getComment());

		supplierContractDao.save(supplierContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeSupplierContract(SupplierContractVO supplierContractVO, String data, String table) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (supplierContractPO.getDownload() != null) return 0;

		JSONObject params = JSONObject.parseObject(data);
		JSONArray tables = JSON.parseArray(table);

		elecsignService.generate(supplierContractPO, params, tables);

		supplierContractDao.update(supplierContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affixSupplierContract(SupplierContractVO supplierContractVO, String userId) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (supplierContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		UserPO signner = userDao.queryUserByUserId(userId);

		supplierContractPO.setSignner(signner);
		supplierContractPO.setStatus(SupplierContractPO.STATUS_SIGN_INT);
		supplierContractPO.setCussignTime(DateUtil.getDateToTimestamp(new Date()));

		supplierContractDao.update(supplierContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expireSupplierContract(SupplierContractVO supplierContractVO) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (supplierContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		supplierContractPO.setStatus(UserContractPO.STATUS_NULL_INT);

		supplierContractDao.update(supplierContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int filingSupplierContract(SupplierContractVO supplierContractVO) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(130002, "合同不存在");
		}

		if (supplierContractPO.getStatus() != UserContractPO.STATUS_SIGN_INT) {
			throw new FLException(130028, "合同不可操作");
		}

		supplierContractPO.setStatus(DecorationContractPO.STATUS_FILE_INT);

		supplierContractDao.update(supplierContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateSupplierContract(SupplierContractVO supplierContractVO) throws FLException {
		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		supplierContractPO.setName(supplierContractVO.getName());
		supplierContractPO.setSignTime(supplierContractVO.getSignTime());
		supplierContractPO.setStartTime(supplierContractVO.getStartTime());
		supplierContractPO.setEndTime(supplierContractVO.getEndTime());
		supplierContractPO.setStatus(supplierContractVO.getStatus());
		supplierContractPO.setComment(supplierContractVO.getComment());

		supplierContractDao.update(supplierContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteSupplierContract(SupplierContractVO supplierContractVO) throws FLException {

		SupplierContractPO supplierContractPO = supplierContractDao.get(supplierContractVO.getScid());

		if (supplierContractPO == null) {
			throw new FLException(190028, "合同不存在");
		}

		if (supplierContractPO.getStatus() != UserContractPO.STATUS_VALID_INT) {
			throw new FLException(190029, "合同不可操作");
		}

		supplierContractDao.delete(supplierContractPO);

		return 0;
	}

}
