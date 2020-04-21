/**
 * @File Name		: AccountServiceImpl.java
 * @Package   	: com.fanglin.finance.service.impl
 * @Version		: 1.0
 * @Date			: 2015-12-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.AccountTmpDao;
import com.fanglin.finance.dao.AssistantTmpDao;
import com.fanglin.finance.dao.FccountDao;
import com.fanglin.finance.dao.SubjectDao;
import com.fanglin.finance.po.FccountPO;
import com.fanglin.finance.po.AccountTmpPO;
import com.fanglin.finance.po.AssistantTmpPO;
import com.fanglin.finance.po.SubjectPO;
import com.fanglin.finance.service.FccountService;
import com.fanglin.finance.vo.FccountVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("fccountService")
@Transactional(readOnly = true)
public class FccountServiceImpl implements FccountService {

	@Autowired
	private SubjectDao subjectDao;

	@Autowired
	private FccountDao accountDao;

	@Autowired
	private AccountTmpDao accountTmpDao;

	@Autowired
	private AssistantTmpDao assistantTmpDao;

	@Override
	public void pageAccount(Paging paging, List<Filter> filters, String condition) {

		List<FccountPO> accountPOs = accountDao.pageAccount(paging, filters, condition);
		List<FccountVO> accountVOs = new ArrayList<FccountVO>();

		for (FccountPO accountPO : accountPOs) {
			FccountVO accountVO = new FccountVO();

			BeanUtil.copyProperties(accountPO, accountVO, Arrays.asList("voucher", "assistant"));

			accountVO.setVoucher(accountPO.getVoucher().packagePOToVO(false));

			if (accountPO.getAssistant() != null) {
				accountVO.setAssistant(accountPO.getAssistant().packageFromPOToVO());
			}

			accountVOs.add(accountVO);
		}

		paging.setData(accountVOs);
	}

	@Override
	public FccountVO queryAccountByAId(FccountVO accountVO) throws FLException {

		AccountTmpPO accountTmpPO = accountTmpDao.get(accountVO.getAid());

		if (accountTmpPO == null) {
			throw new FLException(1250002, "账目信息不存在");
		}

		BeanUtil.copyProperties(accountTmpPO, accountVO, Arrays.asList("voucher", "assistant"));

		if (accountTmpPO.getAssistantTmp() != null) {
			accountVO.setAssistant(accountTmpPO.getAssistantTmp().packageFromTmpToVO());
		}

		return accountVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public FccountVO queryAccountForFormalByAId(FccountVO accountVO) throws FLException {

		FccountPO accountPO = accountDao.get(accountVO.getAid());

		if (accountPO == null) {
			throw new FLException(1250002, "账目信息不存在");
		}

		AccountTmpPO accountTmpPO = new AccountTmpPO();

		accountTmpPO.setAid(accountPO.getAid());

		BeanUtil.copyProperties(accountPO, accountTmpPO, Arrays.asList("voucher", "assistant"));
		BeanUtil.copyProperties(accountPO, accountVO, Arrays.asList("voucher", "assistant"));

		if (accountPO.getAssistant() != null) {
			accountVO.setAssistant(accountPO.getAssistant().packageFromPOToVO());

			AssistantTmpPO assistantTmpPO = accountPO.getAssistant().packageFromPOToTmp();

			assistantTmpDao.save(assistantTmpPO);

			accountTmpPO.setAssistantTmp(assistantTmpPO);
		}

		accountTmpDao.save(accountTmpPO);

		accountVO.setAid(accountTmpPO.getAtId());

		return accountVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAccount(FccountVO accountVO) throws FLException {

		String code = String.format("%s%s%s", accountVO.getOneCode(), accountVO.getTwoCode(), accountVO.getThrCode());

		SubjectPO subjectPO = subjectDao.querySubjectByCode(code);

		if (subjectPO == null) {
			throw new FLException(1010000, "科目不存在");
		}

		AccountTmpPO accountTmpPO = new AccountTmpPO();

		BeanUtil.copyProperties(accountVO, accountTmpPO, Arrays.asList("aid", "voucher", "assistant"));

		accountTmpPO.setSubjectName(subjectPO.getName());

		if (accountVO.getAssistant() != null) {
			AssistantTmpPO assistantTmpPO = accountVO.getAssistant().packageFromVOToTmp();

			assistantTmpDao.save(assistantTmpPO);

			accountTmpPO.setAssistantTmp(assistantTmpPO);
		}

		accountTmpDao.save(accountTmpPO);

		accountVO.setAid(accountTmpPO.getAtId());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAccount(FccountVO accountVO) throws FLException {

		AccountTmpPO accountTmpPO = accountTmpDao.get(accountVO.getAid());

		if (accountTmpPO == null) {
			throw new FLException(1250002, "账目信息不存在");
		}

		BeanUtil.copyProperties(accountVO, accountTmpPO, Arrays.asList("aid", "voucher", "assistant"));

		AssistantTmpPO assistantTmpPO = accountTmpPO.getAssistantTmp();

		if (assistantTmpPO != null) {
			assistantTmpDao.delete(assistantTmpPO);

			accountTmpPO.setAssistantTmp(null);
		}

		if (accountVO.getAssistant() != null) {
			assistantTmpPO = accountVO.getAssistant().packageFromVOToTmp();

			assistantTmpDao.save(assistantTmpPO);

			accountTmpPO.setAssistantTmp(assistantTmpPO);
		}

		accountTmpDao.update(accountTmpPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteAccount(FccountVO accountVO) throws FLException {

		if (accountVO.getAssistant() != null) {
			assistantTmpDao.deleteById(accountVO.getAssistant().getAid());
		}

		accountTmpDao.deleteById(accountVO.getAid());

		return 0;
	}

}
