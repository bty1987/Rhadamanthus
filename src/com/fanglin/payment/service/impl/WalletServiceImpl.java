package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.payment.dao.WalletDao;
import com.fanglin.payment.dao.WalletranDao;
import com.fanglin.payment.po.WalletPO;
import com.fanglin.payment.po.WalletranPO;
import com.fanglin.payment.service.WalletService;
import com.fanglin.payment.vo.WalletVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("walletService")
@Transactional(readOnly = true)
public class WalletServiceImpl implements WalletService {

	@Autowired
	private WalletDao walletDao;

	@Autowired
	private WalletranDao walletranDao;

	@Override
	public void pageWallet(Paging paging, List<Filter> filters) {
		List<WalletPO> walletPOs = walletDao.pageWallet(paging, filters);
		List<WalletVO> walletVOs = new ArrayList<WalletVO>();

		for (WalletPO walletPO : walletPOs) {
			walletVOs.add(walletPOToVO(walletPO));
		}

		paging.setData(walletVOs);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletVO queryWallet(WalletVO wallet) {

		WalletPO walletPO = walletDao.get(wallet.getWid());
		WalletVO walletVO = walletPOToVO(walletPO);

		// TODO 或许需要更新些数据

		return walletVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void applyWallet(WalletVO wallet, String userId) {

		WalletPO walletPO = new WalletPO();

		BeanUtil.copyProperties(wallet, walletPO);

		walletPO.setNo(userId);
		walletPO.setType(WalletPO.TYPE_USER_INT);

		walletDao.save(walletPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletVO bindWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		if (walletPO.getStatus() != WalletPO.STATUS_INIT_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		walletPO.setStatus(WalletPO.STATUS_BIND_INT);

		walletDao.update(walletPO);

		// TODO 获取接口获得sn
		String sn = "";
		wallet.setSn(sn);

		return wallet;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletVO updateWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		if (walletPO.getStatus() != WalletPO.STATUS_INIT_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		walletPO.setPhone(wallet.getPhone());

		walletDao.update(walletPO);

		// TODO 返回验证码？

		return wallet;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		// TODO 这还要做些什么吗

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void freezeWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		// TODO 这里要加绑定状态的判断 不然初始状态可以冻结 冻结之后 再解冻就可以跳过‘初始变绑定’的动作
		if (walletPO.getStatus() != WalletPO.STATUS_BIND_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		walletPO.setStatus(WalletPO.STATUS_FROZEN_INT);

		walletDao.update(walletPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void unfreezeWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		if (walletPO.getStatus() != WalletPO.STATUS_FROZEN_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		walletPO.setStatus(WalletPO.STATUS_BIND_INT);

		walletDao.update(walletPO);

	}

	// 消费
	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletVO consumeWallet(WalletVO wallet, WalletVO tallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());
		WalletPO talletPO = walletDao.queryWalletByNo(tallet.getNo());

		if (walletPO == null || talletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		if (walletPO.getStatus() != WalletPO.STATUS_BIND_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		// 原子扣款(含余额校验): 受影响行数为 0 表示余额不足
		if (walletDao.decreaseWallet(walletPO.getWid(), wallet.getAmount()) == 0) {
			throw new FLException(10000, "余额不足");
		}

		// 原子加款到收款方
		walletDao.increaseWallet(talletPO.getWid(), wallet.getAmount());

		// 生成交易记录
		createWalletran(walletPO, talletPO, wallet.getAmount(), WalletranPO.TYPE_CONSUME_INT, "消费");

		// TODO 获取sn
		String sn = "";
		wallet.setSn(sn);

		return wallet;
	}

	// 充值
	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletVO rechargeWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		if (walletPO.getStatus() != WalletPO.STATUS_BIND_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		// 原子加款
		walletDao.increaseWallet(walletPO.getWid(), wallet.getAmount());
		// TODO 银行卡要减钱

		// 生成交易记录
		createWalletran(walletPO, null, wallet.getAmount(), WalletranPO.TYPE_RECHARGE_INT, "充值");

		// TODO 获取sn
		String sn = "";
		wallet.setSn(sn);

		return wallet;

	}

	// 提现
	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletVO withdrawWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		if (walletPO.getStatus() != WalletPO.STATUS_BIND_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		// 原子扣款(含余额校验): 受影响行数为 0 表示余额不足
		if (walletDao.decreaseWallet(walletPO.getWid(), wallet.getAmount()) == 0) {
			throw new FLException(10000, "余额不足");
		}
		// TODO 银行卡要加钱

		// 生成交易记录
		createWalletran(walletPO, null, wallet.getAmount(), WalletranPO.TYPE_WITHDRAW_INT, "提现");

		// TODO 获取sn
		String sn = "";
		wallet.setSn(sn);

		return wallet;

	}

	// 交易确认
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void consentWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		// TODO 还要做些什么吗

	}

	// 转账
	@Override
	@Transactional(rollbackFor = Exception.class)
	public WalletVO transferWallet(WalletVO wallet, WalletVO tallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());
		WalletPO talletPO = walletDao.queryWalletByNo(tallet.getNo());

		if (walletPO == null || talletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		if (walletPO.getStatus() != WalletPO.STATUS_BIND_INT) {
			throw new FLException(150055, "钱包状态不可操作");
		}

		// 原子扣款(含余额校验): 受影响行数为 0 表示余额不足
		if (walletDao.decreaseWallet(walletPO.getWid(), wallet.getAmount()) == 0) {
			throw new FLException(10000, "余额不足");
		}

		// 原子加款到收款方
		walletDao.increaseWallet(talletPO.getWid(), wallet.getAmount());

		// 生成交易记录
		createWalletran(walletPO, talletPO, wallet.getAmount(), WalletranPO.TYPE_TRANSFER_INT, "转账");

		return wallet;

	}

	// 转账确认
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void approveWallet(WalletVO wallet) throws FLException {

		WalletPO walletPO = walletDao.get(wallet.getWid());

		if (walletPO == null) {
			throw new FLException(150054, "钱包不存在");
		}

		// TODO 还做什么呢;

	}

	public void createWalletran(WalletPO walletPO, WalletPO talletPO, Long amount, short type, String comment) {

		WalletranPO walletranPO = new WalletranPO();

		walletranPO.setNo(walletPO.getNo());
		walletranPO.setWallet(walletPO);
		if (talletPO != null) walletranPO.setTallet(talletPO);
		walletranPO.setAmount(amount);
		walletranPO.setType(type);
		walletranPO.setComment(comment);

		walletranDao.save(walletranPO);

	}

	public WalletVO walletPOToVO(WalletPO walletPO) {

		WalletVO walletVO = new WalletVO(new UserBaseVO());

		BeanUtil.copyProperties(walletPO, walletVO, Arrays.asList("belonger"));
		BeanUtil.copyProperties(walletPO.getBelonger(), walletVO.getBelonger(), Arrays.asList("duty", "dept"));

		return walletVO;

	}

}
