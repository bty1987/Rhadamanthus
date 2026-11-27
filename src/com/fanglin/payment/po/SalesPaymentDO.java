package com.fanglin.payment.po;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.sales.po.SalesPO;
import com.fanglin.sales.po.SalesRefundsPO;
import com.fanglin.utils.BeanUtil;

/**
 * 销售收款分页装配对象(PO关联PO, 照PaymentDO模式): SalesPaymentPO --sid--> SalesPO, SalesPaymentPO --orderId--> DecorationPO.
 * 专供 SalesPaymentServiceImpl.pageSalesPayment 查询装配使用, 装修等级经 sales.decoration.grade 下发(propertyMap.decorationGrade).
 */
@Entity
@Table(name = "salespayment", catalog = "payment")
public class SalesPaymentDO implements Serializable {

    private static final long serialVersionUID = 1L;

    private long spid;

    private SalesPO sales;

    private SalesReceiptPO salesReceipt;

    private SalesRefundsPO salesRefunds;

    private DecorationPO decoration;

    private String orderId;

    private short type;

    private short status;

    private String category;

    private String brand;

    private long referMoney;

    private short isAffirm;

    private Timestamp affirmTime;

    private int company;

    private Timestamp createTime;

    /**
     * PO装配构造: 平铺字段同名列直拷(关联列由关联侧持有), 关联逐个取自PO(查询侧 join fetch 已加载)
     */
    public SalesPaymentDO(SalesPaymentPO salesPaymentPO) {
        super();

        BeanUtil.copyProperties(salesPaymentPO, this, Arrays.asList("sales", "salesReceipt", "salesRefunds", "decoration"));

        this.sales = salesPaymentPO.getSales();
        this.salesReceipt = salesPaymentPO.getSalesReceipt();
        this.salesRefunds = salesPaymentPO.getSalesRefunds();
        this.decoration = salesPaymentPO.getDecoration();
    }

    public SalesPaymentDO() {
        super();
    }

    @Id
    @Column(name = "spid")
    public long getSpid() {
        return spid;
    }

    public void setSpid(long spid) {
        this.spid = spid;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sid", referencedColumnName = "sid")
    public SalesPO getSales() {
        return sales;
    }

    public void setSales(SalesPO sales) {
        this.sales = sales;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "srid", referencedColumnName = "srid")
    public SalesReceiptPO getSalesReceipt() {
        return salesReceipt;
    }

    public void setSalesReceipt(SalesReceiptPO salesReceipt) {
        this.salesReceipt = salesReceipt;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rid", referencedColumnName = "rid")
    public SalesRefundsPO getSalesRefunds() {
        return salesRefunds;
    }

    public void setSalesRefunds(SalesRefundsPO salesRefunds) {
        this.salesRefunds = salesRefunds;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderId", referencedColumnName = "orderId")
    public DecorationPO getDecoration() {
        return decoration;
    }

    public void setDecoration(DecorationPO decoration) {
        this.decoration = decoration;
    }

    @Column(name = "orderId")
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    @Column(name = "type")
    public short getType() {
        return type;
    }

    public void setType(short type) {
        this.type = type;
    }

    @Column(name = "status")
    public short getStatus() {
        return status;
    }

    public void setStatus(short status) {
        this.status = status;
    }

    @Column(name = "category")
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Column(name = "brand")
    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    @Column(name = "referMoney")
    public long getReferMoney() {
        return referMoney;
    }

    public void setReferMoney(long referMoney) {
        this.referMoney = referMoney;
    }

    @Column(name = "isAffirm")
    public short getIsAffirm() {
        return isAffirm;
    }

    public void setIsAffirm(short isAffirm) {
        this.isAffirm = isAffirm;
    }

    @Column(name = "affirmTime")
    public Timestamp getAffirmTime() {
        return affirmTime;
    }

    public void setAffirmTime(Timestamp affirmTime) {
        this.affirmTime = affirmTime;
    }

    @Column(name = "company")
    public int getCompany() {
        return company;
    }

    public void setCompany(int company) {
        this.company = company;
    }

    @Column(name = "createTime")
    public Timestamp getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Timestamp createTime) {
        this.createTime = createTime;
    }

    /**
     * 装配销售收款页返回体(照PaymentDO.dtv): 平铺字段直拷 + 关联逐段ptv/ptvcascade;
     * 装修单挂 sales.decoration 下(前端契约 v.sales.decoration.grade), ptvcascade 全嵌套(house/village/designer/grade)
     */
    public SalesPaymentVO dtv(SalesPaymentVO salesPaymentVO) {

        BeanUtil.copyProperties(this, salesPaymentVO, Arrays.asList("sales", "salesReceipt", "salesRefunds", "decoration"));

        if (getSales() != null) getSales().ptv(salesPaymentVO.getSales());

        if (getSalesReceipt() != null && salesPaymentVO.getSalesReceipt() != null) {

            BeanUtil.copyProperties(getSalesReceipt(), salesPaymentVO.getSalesReceipt(), Arrays.asList("collecter", "confirmer"));

            if (getSalesReceipt().getCollecter() != null && salesPaymentVO.getSalesReceipt().getCollecter() != null) {
                BeanUtil.copyProperties(getSalesReceipt().getCollecter(), salesPaymentVO.getSalesReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));
            }

            if (getSalesReceipt().getConfirmer() != null && salesPaymentVO.getSalesReceipt().getConfirmer() != null) {
                BeanUtil.copyProperties(getSalesReceipt().getConfirmer(), salesPaymentVO.getSalesReceipt().getConfirmer(), Arrays.asList("role", "dept", "duty"));
            }
        }

        if (getSalesRefunds() != null) getSalesRefunds().ptv(salesPaymentVO.getSalesRefunds());

        if (getDecoration() != null && getSales() != null) {

            salesPaymentVO.getSales().setDecoration(new DecorationVO());

            getDecoration().ptvcascade(salesPaymentVO.getSales().getDecoration());
        }

        return salesPaymentVO;
    }
}
