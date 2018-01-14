/**
 * @File Name		: VoucherServiceImpl.java
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
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.finance.dao.AccountDao;
import com.fanglin.finance.dao.AccountTmpDao;
import com.fanglin.finance.dao.AssistantDao;
import com.fanglin.finance.dao.PeriodDao;
import com.fanglin.finance.dao.SubjectBalanceUpinfoDao;
import com.fanglin.finance.dao.VoucherDao;
import com.fanglin.finance.po.AccountPO;
import com.fanglin.finance.po.AccountTmpPO;
import com.fanglin.finance.po.AssistantPO;
import com.fanglin.finance.po.AssistantTmpPO;
import com.fanglin.finance.po.PeriodPO;
import com.fanglin.finance.po.SubjectBalanceUpinfoPO;
import com.fanglin.finance.po.VoucherPO;
import com.fanglin.finance.service.SubjectBalanceService;
import com.fanglin.finance.service.VoucherService;
import com.fanglin.finance.vo.VoucherVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("voucherService")
@Transactional(readOnly=true)
public class VoucherServiceImpl implements VoucherService {
	
	@Autowired
	private PeriodDao periodDao;
	
	@Autowired
	private VoucherDao voucherDao;
	
	@Autowired
	private AccountDao accountDao;
	
	@Autowired
	private AccountTmpDao accountTmpDao;
	
	@Autowired
	private AssistantDao assistantDao;
	
	@Autowired
	private SubjectBalanceUpinfoDao subjectBalanceUpinfoDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CountingService countingService;
	
	@Autowired
	private SubjectBalanceService subjectBalanceService;

	@Override
	public void pageVoucher(Paging paging, List<Filter> filters, String condition) {
		
		List<VoucherPO> voucherPOs = voucherDao.pageVoucher(paging, filters, condition);
		List<VoucherVO> voucherVOs = new ArrayList<VoucherVO>();
		
		for(VoucherPO voucherPO: voucherPOs){
			
			VoucherVO voucherVO = voucherPO.packagePOToVO(true);
			
			voucherVOs.add(voucherVO);
		}
		
		paging.setData(voucherVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public VoucherVO queryVoucherByVId(VoucherVO voucherVO) throws FLException {
		
		VoucherPO voucherPO = voucherDao.queryVoucherByVId(voucherVO.getVid());
		
		if(voucherPO == null){
			throw new FLException(1250001, "凭证信息不存在");
		}
		
		voucherVO = voucherPO.packagePOToVO(true);
		
		if(voucherVO.getLockFlag() != null && voucherVO.getLockFlag() == 1){
			voucherPO.setLockvalue(new Date().getTime());
			
			voucherDao.update(voucherPO);
		}
		
		return voucherVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int addVoucher(VoucherVO voucherVO, List<Long> atIds, String userId) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		PeriodPO periodPO = periodDao.queryPeriodForCurrent();
		
		String period = periodPO.getPeriod();
		
		VoucherPO voucherPO = new VoucherPO();
		
		int wordnum = voucherVO.getWordnum();
		
		int count = countingService.queryCountingByTypeDate(wordnum + 100, CountingPO.COUNTING_DATE_SILNLE_STR);
		String voucherId = String.valueOf(wordnum) + FormatUtil.fillZero(count, "00000000");
		
		voucherPO.setVoucherId(voucherId);
		voucherPO.setWord(voucherVO.getWord());
		voucherPO.setPeriod(period);
		voucherPO.setOriginator(userPO);
		voucherPO.setCreateTime(voucherVO.getCreateTime());
		voucherPO.setReference(voucherVO.getReference());
		voucherPO.setAttachmentNum(voucherVO.getAttachmentNum());
		voucherPO.setComment(voucherVO.getComment());
		
		if(voucherVO.getPostTime() != null){
			voucherPO.setPostTime(voucherVO.getPostTime());
		}
		
		if(voucherVO.getStatus() == VoucherPO.STATUS_TYPE_FORMAL_INT){
			voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		}else{
			voucherPO.setStatus(VoucherPO.STATUS_TYPE_PRECUT_INT);
		}
		
		voucherDao.save(voucherPO);
		
		addVoucherForAccount(periodPO, voucherPO, atIds);
		
		voucherVO.setVid(voucherPO.getVid());
		voucherVO.setVoucherId(voucherPO.getVoucherId());
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateVoucher(VoucherVO voucherVO, List<Long> atIds, List<Long> uatIds, List<Long> datIds) throws FLException {
		
		PeriodPO periodPO = periodDao.queryPeriodForCurrent();
		
		VoucherPO voucherPO = voucherDao.get(voucherVO.getVid());
		
		if(voucherPO == null){
			throw new FLException(1250001, "凭证信息不存在");
		}
		
		if(new Date().getTime() - voucherPO.getLockvalue() < 3 * 60 * 1000){
			throw new FLException(1250009, "凭证处于保护状态,请稍后重试");
		}
		
		short status = voucherPO.getStatus();
		
		if(status != VoucherPO.STATUS_TYPE_PRECUT_INT && status != VoucherPO.STATUS_TYPE_INFORMAL_INT){
			throw new FLException(1250003, "凭证状态不能修改");
		}
		
		voucherPO.setReference(voucherVO.getReference());
		voucherPO.setComment(voucherVO.getComment());
		voucherPO.setAttachmentNum(voucherVO.getAttachmentNum());
		voucherPO.setCreateTime(voucherVO.getCreateTime());
		voucherPO.setPostTime(voucherVO.getPostTime());
		
		addVoucherForAccount(periodPO, voucherPO, atIds);
		updateVoucherForAccount(periodPO, voucherPO, uatIds);
		deleteVoucherForAccount(periodPO, voucherPO, datIds);
		
		voucherDao.update(voucherPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int postVoucher(VoucherVO voucherVO, String userId) throws FLException {
		
		float total = 0;
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		VoucherPO voucherPO = voucherDao.get(voucherVO.getVid());
		Map<String, List<Float>> subjectBalances = new HashMap<String, List<Float>>();
		
		if(voucherPO == null){
			throw new FLException(1250001, "凭证信息不存在");
		}
		
		String period = voucherPO.getPeriod();
		short status = voucherPO.getStatus();
		
		if(status != VoucherPO.STATUS_TYPE_PRECUT_INT && status != VoucherPO.STATUS_TYPE_INFORMAL_INT){
			throw new FLException(1250005, "凭证状态不能审核");
		}
		
		if(voucherPO.getOriginator().getUserId().equals(userId)){
			throw new FLException(1250007, "审核凭证人员不能为凭证创建人员");
		}
		
		Set<AccountPO> accountPOs = voucherPO.getAccounts();
		
		if(accountPOs != null && accountPOs.size() != 0){
			for(AccountPO accountPO: accountPOs){
				
				float debit = accountPO.getDebit();
				float credit = accountPO.getCredit();
				
				total = Arith.add(total, debit);
				total = Arith.sub(total, credit);
				
				if(status == VoucherPO.STATUS_TYPE_PRECUT_INT){
					collectSubjectBalanceMap(subjectBalances, accountPO, period);
				}
			}
		}
		
		if(total != 0){
			throw new FLException(1250006, "凭证借贷金额总和不为零");
		}
		
		if(voucherPO.getPostTime() == null){
			voucherPO.setPostTime(DateUtil.getDateToTimestamp(new Date()));
		}
		
		voucherPO.setPostor(userPO);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
		
		accountDao.updateAccountForStatusByVId(voucherPO.getVid(), AccountPO.STATUS_TYPE_FORMAL_INT);
		
		voucherDao.update(voucherPO);
		
		handleSubjectBalance(subjectBalances);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int postVouchers(List<Long> vIds, String userId) throws FLException {
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		
		if(userPO == null){
			throw new FLException(190005, "人员不存在");
		}
		
		List<VoucherPO> voucherPOs = voucherDao.queryVoucherByVIds(vIds);
		Map<String, List<Float>> subjectBalances = new HashMap<String, List<Float>>();
		
		for(VoucherPO voucherPO: voucherPOs){
			
			float total = 0;
			
			if(voucherPO == null){
				continue;
			}
			
			String period = voucherPO.getPeriod();
			short status = voucherPO.getStatus();
			
			if(status != VoucherPO.STATUS_TYPE_PRECUT_INT && status != VoucherPO.STATUS_TYPE_INFORMAL_INT){
				continue;
			}
			
			Set<AccountPO> accountPOs = voucherPO.getAccounts();
			
			if(accountPOs != null && accountPOs.size() != 0){
				for(AccountPO accountPO: accountPOs){
					
					float debit = accountPO.getDebit();
					float credit = accountPO.getCredit();
					
					total = Arith.add(total, debit);
					total = Arith.sub(total, credit);
					
					if(status == VoucherPO.STATUS_TYPE_PRECUT_INT){
						collectSubjectBalanceMap(subjectBalances, accountPO, period);
					}
				}
			}
			
			if(total != 0){
				continue;
			}
			
			if(voucherPO.getPostTime() == null){
				voucherPO.setPostTime(DateUtil.getDateToTimestamp(new Date()));
			}
			
			voucherPO.setPostor(userPO);
			voucherPO.setStatus(VoucherPO.STATUS_TYPE_FORMAL_INT);
			
			accountDao.updateAccountForStatusByVId(voucherPO.getVid(), AccountPO.STATUS_TYPE_FORMAL_INT);
			
			voucherDao.update(voucherPO);
		}
		
		handleSubjectBalance(subjectBalances);
		
		return 0;
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int inpostVoucher(VoucherVO voucherVO, String userId) throws FLException {
		
		VoucherPO voucherPO = voucherDao.get(voucherVO.getVid());
		
		if(voucherPO == null){
			throw new FLException(1250001, "凭证信息不存在");
		}
		
		if(voucherPO.getStatus() != VoucherPO.STATUS_TYPE_FORMAL_INT){
			throw new FLException(1250008, "凭证状态不能反审核");
		}
		
		voucherPO.setPostTime(null);
		voucherPO.setPostor(null);
		voucherPO.setStatus(VoucherPO.STATUS_TYPE_INFORMAL_INT);
		
		accountDao.updateAccountForStatusByVId(voucherPO.getVid(), AccountPO.STATUS_TYPE_PRECUT_INT);
		
		voucherDao.update(voucherPO);
		
		return 0;
	}

	private int addVoucherForAccount(PeriodPO periodPO, VoucherPO voucherPO, List<Long> atIds) throws FLException{
		
		if(atIds == null || atIds.size() == 0){
			return 0;
		}
		
		List<AccountTmpPO> accountTmpPOs = accountTmpDao.queryAccountTmpByAtIds(atIds);
		
		for(AccountTmpPO accountTmpPO: accountTmpPOs){
			
			AccountPO accountPO = new AccountPO();
			
			BeanUtil.copyProperties(accountTmpPO, accountPO, Arrays.asList("aid", "voucher", "assistant"));
			
			accountPO.setWord(voucherPO.getWord());
			accountPO.setPeriod(voucherPO.getPeriod());
			accountPO.setVoucher(voucherPO);
			
			AssistantTmpPO assistantTmpPO = accountTmpPO.getAssistantTmp();
			
			if(assistantTmpPO != null){
				
				AssistantPO assistantPO = assistantTmpPO.packageFromTmpToPO();
				
				assistantDao.save(assistantPO);
				
				accountPO.setAssistant(assistantPO);
			}
			
			accountDao.save(accountPO);
			
			String code = String.format("%s%s%s", accountPO.getOneCode(), accountPO.getTwoCode(), accountPO.getThrCode());
			
			handleSubjectBalance(code, accountPO.getDebit(), accountPO.getCredit(), periodPO, voucherPO.getStatus(), voucherPO.getPeriod());
		}
		
		return 0;
	}
	
	private int updateVoucherForAccount(PeriodPO periodPO, VoucherPO voucherPO, List<Long> uatIds) throws FLException{
		
		if(uatIds == null || uatIds.size() == 0){
			return 0;
		}
		
		List<AccountTmpPO> accountTmpPOs = accountTmpDao.queryAccountTmpByAtIds(uatIds);
		
		for(AccountTmpPO accountTmpPO: accountTmpPOs){
			AccountPO accountPO = accountDao.get(accountTmpPO.getAid());
			
			float tmpdebit = Arith.sub(accountTmpPO.getDebit(), accountPO.getDebit());
			float tmpcrebit = Arith.sub(accountTmpPO.getCredit(), accountPO.getCredit());
			
			BeanUtil.copyProperties(accountTmpPO, accountPO, Arrays.asList("aid", "voucher", "assistant"));
			
			AssistantPO assistantPO = accountPO.getAssistant();
			
			if(assistantPO != null){
				assistantDao.delete(assistantPO);
				
				accountPO.setAssistant(null);
			}
			
			AssistantTmpPO assistantTmpPO = accountTmpPO.getAssistantTmp();
			
			if(assistantTmpPO != null){
				assistantPO = assistantTmpPO.packageFromTmpToPO();
				
				assistantDao.save(assistantPO);
				
				accountPO.setAssistant(assistantPO);
			}
			
			accountDao.update(accountPO);
			
			String code = String.format("%s%s%s", accountPO.getOneCode(), accountPO.getTwoCode(), accountPO.getThrCode());
			
			handleSubjectBalance(code, tmpdebit, tmpcrebit, periodPO, voucherPO.getStatus(), voucherPO.getPeriod());
		}
		
		return 0;
	}
	
	private int deleteVoucherForAccount(PeriodPO periodPO, VoucherPO voucherPO, List<Long> datIds) throws FLException{
		
		if(datIds == null){
			return 0;
		}
		
		for(long datId: datIds){
			AccountPO accountPO = accountDao.get(datId);
			
			if(accountPO.getAssistant() != null){
				assistantDao.delete(accountPO.getAssistant());
			}
			
			accountDao.delete(accountPO);
			
			float tmpdebit = Arith.sub(0, accountPO.getDebit());
			float tmpcrebit = Arith.sub(0, accountPO.getCredit());
			
			String code = String.format("%s%s%s", accountPO.getOneCode(), accountPO.getTwoCode(), accountPO.getThrCode());
			
			handleSubjectBalance(code, tmpdebit, tmpcrebit, periodPO, voucherPO.getStatus(), voucherPO.getPeriod());
		}
		
		return 0;
	}
	
	private int handleSubjectBalance(String code, float debit, float crebit, PeriodPO currentPeriodPO, short voucherStatus, String period){
		
		if(voucherStatus == VoucherPO.STATUS_TYPE_PRECUT_INT){
			return 0;
		}
		
		SubjectBalanceUpinfoPO subjectBalanceUpinfoPO = new SubjectBalanceUpinfoPO();

		subjectBalanceUpinfoPO.setCode(code);
		subjectBalanceUpinfoPO.setPeriod(period);
		subjectBalanceUpinfoPO.setDebit(debit);
		subjectBalanceUpinfoPO.setCredit(crebit);
		subjectBalanceUpinfoPO.setStatus(SubjectBalanceUpinfoPO.STATUS_INIT_INT);
		
		subjectBalanceUpinfoDao.save(subjectBalanceUpinfoPO);
		
		return 0;
	}
	
	private int handleSubjectBalance(Map<String, List<Float>> subjectBalances){
		
		for(String key: subjectBalances.keySet()){
			List<Float> balances = subjectBalances.get(key);
			
			String code = key.split("-")[0];
			String period = key.split("-")[1];
			
			subjectBalanceService.alowSubjectBalanceForBalanceByCodeAPeriod(code, period, balances.get(0), balances.get(1));
		}
		
		return 0;
	}
	
	private int collectSubjectBalanceMap(Map<String, List<Float>> subjectBalances, AccountPO accountPO, String period){
		
		float debit = accountPO.getDebit();
		float crebit = accountPO.getCredit();
		
		String key = String.format("%s%s%s-%s", accountPO.getOneCode(), accountPO.getTwoCode(), accountPO.getThrCode(), period);
		
		if(subjectBalances.get(key) != null){
			List<Float> balances = subjectBalances.get(key);
			
			balances.set(0, Arith.add(balances.get(0), debit));
			balances.set(1, Arith.add(balances.get(1), crebit));
		}else{
			List<Float> balances = new ArrayList<Float>();
			
			balances.add(debit);
			balances.add(crebit);
			
			subjectBalances.put(key, balances);
		}
		
		return 0;
	}

}
