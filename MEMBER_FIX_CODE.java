package com.fanglin.customer.service.impl;

import java.util.*;

// ... 其他 import 保持不变

@Service("MemberService")
public class MemberServiceImpl implements MemberService {

    // ... 其他字段和方法保持不变

    @Override
    public Map<String, List<MemberVO>> queryMember(List<MemberVO> members) throws FLException {

        if (null == members || members.isEmpty()) {
            throw new FLException(130021, "客户电话不存在");
        }

        members = members.subList(0, Math.min(10, members.size()));

        Map<String, List<MemberVO>> resultMap = new HashMap<String, List<MemberVO>>();
        Map<String, List<Long>> phoneToCustomerMap = new HashMap<String, List<Long>>();

        List<Integer> companyIds = new ArrayList<Integer>();
        List<Long> customerIds = new ArrayList<Long>();
        List<String> phoneList = new ArrayList<String>();
        List<String> orderIdList = new ArrayList<String>();
        List<String> orderKeyList = new ArrayList<String>();

        // 收集所有查询条件：手机号或装修单号
        for (MemberVO member : members) {
            if (member.getOrderId() != null && !member.getOrderId().isEmpty()) {
                // 装修单号查询
                orderIdList.add(member.getOrderId());
                orderKeyList.add(member.getOrderId());
            } else if (member.getPhone() != null) {
                // 手机号查询
                phoneList.add(FormatUtil.encodePhone(member.getPhone()));
                resultMap.put(member.getPhone(), new ArrayList<MemberVO>());
            }
        }

        // ========== 按装修单号查询 ==========
        if (!orderIdList.isEmpty()) {
            Map<String, String> orderIdToKeyMap = new HashMap<String, String>();

            // 1. 收集所有订单信息（避免重复查询）
            List<DecorationPO> orderDecorationPOs = new ArrayList<DecorationPO>();
            for (int i = 0; i < orderIdList.size(); i++) {
                String orderId = orderIdList.get(i);
                String key = orderKeyList.get(i);
                orderIdToKeyMap.put(orderId, key);
                resultMap.put(key, new ArrayList<MemberVO>());

                DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);
                if (decorationPO != null) {
                    orderDecorationPOs.add(decorationPO);
                    companyIds.add(decorationPO.getCompany());
                }
            }

            // 2. 批量查询所有公司信息（只查询一次）- 性能优化
            Map<Integer, String> companyMap = new HashMap<Integer, String>();
            if (!companyIds.isEmpty()) {
                List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(companyIds);
                for (CompanyPO companyPO : companyPOs) {
                    companyMap.put(companyPO.getCid(), companyPO.getName());
                }
            }

            // 3. 构建结果（使用已查询的订单和公司信息）
            for (int i = 0; i < orderIdList.size(); i++) {
                String orderId = orderIdList.get(i);
                String key = orderKeyList.get(i);

                // 从已查询的列表中获取订单（避免重复查询数据库）
                DecorationPO decorationPO = null;
                for (DecorationPO po : orderDecorationPOs) {
                    if (po.getOrderId().equals(orderId)) {
                        decorationPO = po;
                        break;
                    }
                }

                if (decorationPO != null) {
                    Integer companyId = decorationPO.getCompany();
                    String companyName = companyMap.get(companyId);
                    MemberVO resultMember = new MemberVO().init(decorationPO, companyName, companyId);
                    resultMap.get(key).add(resultMember);
                }
            }
        }

        // ========== 按手机号查询 ==========
        if (!phoneList.isEmpty()) {
            List<CustomerPO> customers = customerDao.queryCustomer(phoneList);

            for (CustomerPO customerPO : customers) {

                List<Long> customerIdList = phoneToCustomerMap.get(customerPO.getPhone());

                if (customerIdList == null) {
                    customerIdList = new ArrayList<Long>();
                    phoneToCustomerMap.put(customerPO.getPhone(), customerIdList);
                }

                if (customerIdList.contains(customerPO.getCid())) continue;

                customerIdList.add(customerPO.getCid());
            }

            List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhone(phoneList, CustomerPhonePO.STATUS_ENABLE_INT, null, null);

            for (CustomerPhonePO customerPhone : customerPhones) {

                List<Long> customerIdList = phoneToCustomerMap.get(customerPhone.getPhone());

                if (customerIdList == null) {
                    customerIdList = new ArrayList<Long>();
                    phoneToCustomerMap.put(customerPhone.getPhone(), customerIdList);
                }

                if (customerIdList.contains(customerPhone.getCid())) continue;

                customerIdList.add(customerPhone.getCid());
            }

            for (CustomerPhonePO customerPhone : customerPhones) {
                customerIds.add(customerPhone.getCid());
            }

            if (customerIds == null || customerIds.size() == 0) {
                throw new FLException(130006, "客户电话不存在");
            }

            List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);

            if (decorationPOs == null || decorationPOs.size() == 0) {
                throw new FLException(130006, "客户装修信息不存在");
            }

            Map<Long, List<DecorationPO>> customerToDecorationMap = new HashMap<Long, List<DecorationPO>>();

            for (DecorationPO decorationPO : decorationPOs) {
                companyIds.add(decorationPO.getCompany());

                Long customerId = decorationPO.getCustomer().getCid();
                List<DecorationPO> decorationList = customerToDecorationMap.get(customerId);
                if (decorationList == null) {
                    decorationList = new ArrayList<DecorationPO>();
                    customerToDecorationMap.put(customerId, decorationList);
                }

                decorationList.add(decorationPO);
            }

            if (companyIds == null || companyIds.size() == 0) {
                throw new FLException(130006, "客户公司不存在");
            }

            Map<Integer, String> companyMap = new HashMap<Integer, String>();

            List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(companyIds);

            for (CompanyPO companyPO : companyPOs) {
                companyMap.put(companyPO.getCid(), companyPO.getName());
            }

            for (MemberVO member : members) {
                String originalPhone = member.getPhone();
                if (originalPhone == null) continue;

                String encodedPhone = FormatUtil.encodePhone(originalPhone);

                List<Long> customerIdList = phoneToCustomerMap.get(encodedPhone);
                if (customerIdList == null) {
                    continue;
                }

                List<MemberVO> memberList = resultMap.get(originalPhone);
                for (Long customerId : customerIdList) {
                    List<DecorationPO> decorations = customerToDecorationMap.get(customerId);
                    if (decorations == null) {
                        continue;
                    }

                    for (DecorationPO decorationPO : decorations) {
                        String companyName = companyMap.get(decorationPO.getCompany());
                        Integer companyId = decorationPO.getCompany();
                        MemberVO resultMember = new MemberVO().init(decorationPO, companyName, companyId);

                        resultMember.setPhone(originalPhone);
                        memberList.add(resultMember);
                    }
                }
            }
        }

        return resultMap;
    }

    // ... 其他方法保持不变
}
