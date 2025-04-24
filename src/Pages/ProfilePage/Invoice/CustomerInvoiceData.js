import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { format, parse } from 'date-fns';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 30,
    fontFamily: 'Helvetica',
    position: 'relative', // Required to pin footer
  },
  section: {
    marginBottom: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  address: {
    width: '50%',
    paddingRight: 10,
  },
  smallText: {
    fontSize: 8, // or any size you prefer
  },
  invoiceMeta: {
    width: '50%',
    paddingLeft: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  table: {
    marginTop: 10,
    border: '1 solid #000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #000',
    fontWeight: 'bold',
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #ccc',
    paddingVertical: 2,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  totalSection: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  signature: {
    marginTop: 30,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    textAlign: 'center',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    borderTop: '1 solid #000',
    paddingTop: 4,
  },
  signatureContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  signatureImage: {
    width: 100,
    height: 50,
    marginBottom: 5,
  },
  signatureText: {
    fontSize: 10,
    textAlign: 'right',
  },
});
const formatCurrency = (value) => {
  if (!value) return "0.00";
  const numValue = parseFloat(value) || 0;
  return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const numberToWords = (num) => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
    'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'Overflow';
    const nNum = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nNum) return;
    let str = '';
    str += (Number(nNum[1]) !== 0) ? (a[Number(nNum[1])] || b[nNum[1][0]] + ' ' + a[nNum[1][1]]) + ' Crore ' : '';
    str += (Number(nNum[2]) !== 0) ? (a[Number(nNum[2])] || b[nNum[2][0]] + ' ' + a[nNum[2][1]]) + ' Lakh ' : '';
    str += (Number(nNum[3]) !== 0) ? (a[Number(nNum[3])] || b[nNum[3][0]] + ' ' + a[nNum[3][1]]) + ' Thousand ' : '';
    str += (Number(nNum[4]) !== 0) ? (a[Number(nNum[4])] || b[nNum[4][0]] + ' ' + a[nNum[4][1]]) + ' Hundred ' : '';
    str += (Number(nNum[5]) !== 0) ? ((str !== '') ? 'and ' : '') +
      (a[Number(nNum[5])] || b[nNum[5][0]] + ' ' + a[nNum[5][1]]) + ' ' : '';
    return str.trim() ;
  };

  return inWords(Math.floor(num));
};


const CustomerInvoiceData = ({ data }) => {
  if (!data) return null;

const getFormattedDate = (rawDate) => {
  if (!rawDate) return '';
  
  const datePart = rawDate.split(',')[0]; // "02 Apr"
  const parsed = parse(datePart, 'dd MMM', new Date());
  
  return format(parsed, 'dd MMMM yyyy'); // "02 April 2025"
};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Tax Invoice</Text>

        <View style={styles.row}>
          <View style={styles.address}>
            <Text style={styles.bold}>{data?.guest_name || "Customer Name"}</Text>
            {/* <Text>Booking ID: {data?.booking_id || "N/A"}</Text> */}
            <Text  style={styles.smallText}>Address: {data?.visit_address || "N/A"}</Text>
          </View>
          {/* <View style={styles.invoiceMeta}>
            <Text>Invoice issued by {data?.issuer_name || " Servyo Powered by Allify Home Solutions Private Limited"}</Text>
            <Text>On behalf of: {data?.partner?.name || " Servyo Partner"}</Text>
            <Text>{data?.state || "Delhi, IN-DL, India"}</Text>
          </View> */}
        </View>

        <View style={styles.section}>
          <Text>Invoice number: {data?.invoice_number_customer || "N/A"}</Text>
          <Text>Invoice date: {data?.booking_date_time?.split(',').slice(0, 2).join(',') || "N/A"}</Text>
          <Text>Place of supply (Name of state): {data?.company_to_customer?.state || "N/A"}</Text>
          <Text>SAC Code: {data?.company_to_customer?.sac_code || "N/A"}</Text>
          <Text>Category of service: {data?.category?.category_name || "Services"}</Text>
          <Text>
            Tax is payable on reverse charge basis: {data?.reverse_charge ? "Yes" : "No"}
          </Text>
        </View>

        <View style={styles.table}>
  <View style={styles.tableHeader}>
    <Text style={[styles.cell, { flex: 2 }]}>Tax Point Date</Text>
    <Text style={[styles.cell, { flex: 3 }]}>Description</Text>
    <Text style={styles.cell}>Qty</Text>
    <Text style={styles.cell}>Net Amount</Text>
  </View>

  {[
    {
      date: data?.tax_date || 'xxx',
      description: 'Convenience and platform fees',
      qty: 1,
      amount: data?.company_to_customer?.net_amount,
    },
    // {
    //   date: data?.tax_date || 'xxx',
    //   description: 'Platform Fees',
    //   qty: 1,
    //   amount: data?.sub_category?.platform_fee,
    // },
    data?.company_to_customer?.tax?.igst && {
      date: data?.tax_date || 'xxx',
      description: 'IGST (18%)',
      qty: '',
      amount: data?.company_to_customer?.tax?.igst,
    },
    data?.company_to_customer?.tax?.cgst && {
      date: data?.tax_date || 'xxx',
      description: 'CGST (9%)',
      qty: '',
      amount: data?.company_to_customer?.tax?.cgst,
    },
    data?.company_to_customer?.tax?.sgst && {
      date: data?.tax_date || 'xxx',
      description: 'SGST/UTGST (9%)',
      qty: '',
      amount: data?.company_to_customer?.tax?.sgst,
    },
  ]
    .filter(Boolean) 
    .map((item, index) => (
      <View style={styles.tableRow} key={index}>
<Text style={[styles.cell, { flex: 2 }]}>
  {getFormattedDate(data?.booking_date_time)}
</Text>

        <Text style={[styles.cell, { flex: 3 }]}>{item.description}</Text>
        <Text style={styles.cell}>{item.qty}</Text>
        <Text style={styles.cell}>{item.amount || '₹0.00'}</Text>
      </View>
  ))}
</View>

<View style={styles.totalSection}>
  <Text>Total net amount: {formatCurrency(data?.company_to_customer?.net_amount)}</Text>
  <Text>Total Tax: {formatCurrency(data?.company_to_customer?.gst)}</Text>
  <Text style={styles.bold}>
    Total amount payable: {formatCurrency(data?.company_to_customer?.total_amount)}
  </Text>
  {data?.billing_amount && (
    <Text>({numberToWords(data?.company_to_customer?.total_amount)} Rupees Only)</Text>
  )}
</View>

<View style={styles.signatureContainer}>
    <Image
      style={styles.signatureImage}
      src="/Signature/Signature.jpg"
    />
    <Text style={styles.signatureText}>Authorized Signature</Text>
  </View>

        <Text style={styles.footer}>
        Allify Home Solutions Private Limited / GST: xxxxx
        {/* <Text style={styles.header}> Allify Home Solutions Private Limited / GST: xxxxx</Text> */}
          {"\n"}
          H no. 5/43, second floor, punjabi bagh road no. 43,punjabi bagh sec-3, west delhi, new delhi, delhi, india, 110026 
        </Text>
      </Page>
    </Document>
  );
};

export default CustomerInvoiceData;
