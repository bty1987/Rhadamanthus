package com.fanglin.personel.service.impl;

import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.enums.ElecsignScene;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.elecsign.service.ElecsignService;
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
	private ElecsignRouter elecsignRouter;
	@Autowired
	private SupplierContractDao supplierContractDao;

	@Autowired
	private UserDao userDao;

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

		return routeForRecord(supplierContractPO).view(supplierContractPO);
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

		routeForRecord(supplierContractPO).autosign(signetVO.getSignno(), signetVO.getKeyword(), supplierContractPO, signetVO.getSignid());

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

		return routeForRecord(supplierContractPO).extsign(supplierSignetVO.getSignno(), supplierContractPO);
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

		routeForCreate(supplierContractPO, 0).generate(supplierContractPO, params, tables);

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
			throw new FLException(130179, "合同不存在");
		}

		if (supplierContractPO.getStatus() != UserContractPO.STATUS_SIGN_INT) {
			throw new FLException(130185, "合同不可操作");
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

	/** 电子签路由（生成/上传：重签按记录厂商，首签按公司×场景配置并记录厂商到合同 provider 字段） */
	private ElecsignService routeForCreate(SupplierContractPO supplierContractPO, int company) throws FLException {

		if (supplierContractPO.getProvider() != null) {
			return elecsignRouter.route(supplierContractPO.getProvider(), company);
		}

		ElecsignProvider provider = elecsignRouter.resolveProvider(company, ElecsignScene.SUPPLIER);

		supplierContractPO.setProvider(provider.code());

		return elecsignRouter.route(provider);
	}

	/** 电子签路由（签署/查看/归档：按合同记录的厂商路由，保证全链路厂商一致与历史可回溯；null 视同法大大） */
	private ElecsignService routeForRecord(SupplierContractPO supplierContractPO) throws FLException {
		return elecsignRouter.route(supplierContractPO.getProvider());
	}

}
